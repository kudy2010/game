// ── COMBAT SCREEN ─────────────────────────────────────────────────────────────
function CombatScreen(props) {
    var hero = props.hero, equipped = props.equipped, enemy = props.enemy, questName = props.questName;
    var onWin = props.onWin, onLose = props.onLose, onFlee = props.onFlee;
    var potions = props.potions, onUsePotion = props.onUsePotion;
    var heroPerks = hero.perks || [];
    var heroMaxHp = hero.maxHp; // true max HP for display
    var totalStats = computeStats(hero, equipped);
    var initEHp = useRef(enemy.hp);
    var hpRef = useRef({ h: hero.hp, e: enemy.hp });
    var cancelRef = useRef(false), busyRef = useRef(false), autoRef = useRef(null), ironWillUsed = useRef(false);
    // ── Class ability refs ──────────────────────────────────────────────────────
    var firstShotFired  = useRef(false);          // Musketeer: first attack always hits
    var knightBlockReady= useRef(false);          // Knight: auto-block every 3rd round
    var poisonRef       = useRef(0);              // Alchemist: poison rounds remaining
    var _poison = useState(0); var poisonRounds = _poison[0]; var setPoisonRounds = _poison[1];
    var _hp = useState({ h: hero.hp, e: enemy.hp });
    var hp = _hp[0];
    var setHp = _hp[1];
    var _an = useState({ hero: "idle", enemy: "idle" });
    var anim = _an[0];
    var setAnim = _an[1];
    var _pf = useState({ hero: null, enemy: null });
    var pf = _pf[0];
    var setPf = _pf[1];
    var _log = useState([{ t: "info", msg: "⚔️ " + enemy.name + " blokuje drogę!" }, { t: "info", msg: "📖 " + (enemy.desc || "Przygotuj się do walki!") }]);
    var log = _log[0];
    var setLog = _log[1];
    var _flt = useState([]);
    var floats = _flt[0];
    var setFloats = _flt[1];
    var _busy = useState(false);
    var busy = _busy[0];
    var setBusy = _busy[1];
    var _out = useState(null);
    var outcome = _out[0];
    var setOutcome = _out[1];
    var _auto = useState(false);
    var auto = _auto[0];
    var setAuto = _auto[1];
    var _rnd = useState(0);
    var round = _rnd[0];
    var setRound = _rnd[1];
    var _react = useState({ hero: null, enemy: null });
    var reactions = _react[0];
    var setReactions = _react[1];
    var _sflash = useState(null);
    var screenFlash = _sflash[0];
    var setScreenFlash = _sflash[1];
    var updHP = function (h, e) { hpRef.current = { h: h, e: e }; setHp({ h: h, e: e }); };
    var addLog = function (t, m) { setLog(function (p) { return [{ t: t, msg: m }].concat(p).slice(0, 20); }); };
    var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    var spawnFloat = function (text, side, big, color) { var id = Date.now() + Math.random(); setFloats(function (f) { return f.concat([{ id: id, text: text, side: side, big: big, color: color }]); }); setTimeout(function () { setFloats(function (f) { return f.filter(function (x) { return x.id !== id; }); }); }, 1150); };
    var flashPanel = function (side, color) { setPf(function (p) { var n = Object.assign({}, p); n[side] = color; return n; }); setTimeout(function () { setPf(function (p) { var n = Object.assign({}, p); n[side] = null; return n; }); }, 530); };
    var sfxM = { miss: SFX.miss, dodge: SFX.dodge, block: SFX.block, hit: SFX.hit, crit: SFX.crit };
    var showReact = function (side, role, type) {
        var text = pickReact(side, role, type);
        if (!text)
            return;
        setReactions(function (r) { return Object.assign({}, r, { [side]: text }); });
        setTimeout(function () { setReactions(function (r) { return Object.assign({}, r, { [side]: null }); }); }, 2300);
    };
    var doFlash = function (c) { setScreenFlash(c); setTimeout(function () { setScreenFlash(null); }, 600); };
    var doRound = function () {
        if (busyRef.current || cancelRef.current)
            return;
        busyRef.current = true;
        setBusy(true);
        SFX.attack();
        setAnim({ hero: "attack", enemy: "idle" });
        wait(360).then(function () {
            if (cancelRef.current) { busyRef.current = false; setBusy(false); return; }
            setAnim({ hero: "idle", enemy: "idle" });
            var hHp = hpRef.current.h, eHp = hpRef.current.e;
            // ── ALCHEMIST: poison tick at round start ─────────────────────────────
            if (hero.class === "alchemist" && poisonRef.current > 0) {
                var pdmg = 5 + Math.floor((totalStats.int || 0) * 0.3);
                eHp = Math.max(0, eHp - pdmg);
                poisonRef.current = Math.max(0, poisonRef.current - 1);
                setPoisonRounds(poisonRef.current);
                spawnFloat("☠ " + pdmg, "enemy", false, "#88ff44");
                addLog("hit", "☠️ Trucizna: " + pdmg + " dmg (" + poisonRef.current + " rund)");
                updHP(hHp, eHp);
                if (eHp <= 0) {
                    setAnim({ hero: "idle", enemy: "dead" });
                    addLog("win", "🏆 " + enemy.name + " pokonany trucizną!");
                    SFX.win(); setOutcome("win"); busyRef.current = false; setBusy(false); return;
                }
            }
            // ── MUSKETEER: first shot always hits ─────────────────────────────────
            var forceHit = hero.class === "musketeer" && !firstShotFired.current;
            if (forceHit) { firstShotFired.current = true; addLog("info", "🎯 Pierwszy Strzał — gwarantowane trafienie!"); }
            var pr = rollRound(totalStats, enemy.stats, forceHit);
            // Hero perk mods on outgoing damage
            if (pr.dmg > 0) {
                if (heroPerks.indexOf("berserker") >= 0 && hHp < heroMaxHp * 0.3)
                    pr.dmg = Math.floor(pr.dmg * 1.25);
                if (heroPerks.indexOf("lucky_strike") >= 0 && Math.random() < 0.1) {
                    pr.dmg = pr.dmg * 3; pr.type = "crit";
                }
                if (pr.type === "crit" && heroPerks.indexOf("powder_keg") >= 0)
                    pr.dmg = Math.floor(pr.dmg * 1.4);
            }
            // ── ALCHEMIST: poison proc on crit (20%) ──────────────────────────────
            if (pr.type === "crit" && hero.class === "alchemist" && poisonRef.current === 0 && Math.random() < 0.2) {
                poisonRef.current = 3; setPoisonRounds(3);
                addLog("info", "☠️ Trucizna! 3 rundy × " + (5 + Math.floor((totalStats.int || 0) * 0.3)) + " dmg");
                spawnFloat("☠ TRUCIZNA!", "enemy", true, "#88ff44");
            }
            var newEHp = Math.max(0, eHp - pr.dmg);
            var newHHp = hHp;
            if (pr.dmg > 0 && heroPerks.indexOf("vampiric") >= 0) {
                var vh = Math.max(1, Math.floor(pr.dmg * 0.15));
                newHHp = Math.min(heroMaxHp, hHp + vh);
                spawnFloat("+" + vh, "hero", false, "#44dd88");
            }
            var eReact = pr.type === "dodge" ? "dodge" : pr.type === "block" ? "block" : pr.dmg > 0 ? (pr.type === "crit" ? "crit" : "hit") : "idle";
            setAnim({ hero: "idle", enemy: eReact });
            if (pr.dmg > 0) {
                flashPanel("enemy", pr.type === "crit" ? "red" : "gold");
                spawnFloat(pr.type === "crit" ? "💥 " + pr.dmg + "!" : "-" + pr.dmg, "enemy", pr.type === "crit", pr.type === "crit" ? "#ff3333" : "#ffaa00");
                if (pr.type === "crit") doFlash("crit"); else doFlash("hit");
            }
            if (pr.type === "hit" || pr.type === "crit" || pr.type === "miss")
                showReact("hero", "atk", pr.type);
            else if (pr.type === "dodge") showReact("enemy", "def", "dodge");
            else if (pr.type === "block") showReact("enemy", "def", "block");
            updHP(newHHp, newEHp);
            if (sfxM[pr.type]) sfxM[pr.type]();
            addLog(pr.type, { miss: "❌ Twój atak trafia powietrze.", dodge: "💨 " + enemy.name + " unika ciosu!", block: "🛡️ Zablokowane! " + pr.dmg + " dmg przeszło.", hit: "⚔️ Zadajesz " + pr.dmg + " dmg!", crit: "💥 KRYTYK! " + pr.dmg + " dmg!!!" }[pr.type]);
            // ── KNIGHT: prepare auto-block every 3rd round ────────────────────────
            if (hero.class === "knight" && round % 3 === 2) {
                knightBlockReady.current = true;
                addLog("info", "🛡️ Stance! Następny atak wroga zablokowany.");
                spawnFloat("🛡 STANCE", "hero", false, "#e08844");
            }
            return wait(490).then(function () {
                if (cancelRef.current) { busyRef.current = false; setBusy(false); return; }
                if (newEHp <= 0) {
                    setAnim({ hero: "idle", enemy: "dead" });
                    addLog("win", "🏆 " + enemy.name + " defeated!");
                    SFX.win(); setOutcome("win"); busyRef.current = false; setBusy(false); return;
                }
                setAnim({ hero: "idle", enemy: "idle" });
                return wait(190).then(function () {
                    if (cancelRef.current) { busyRef.current = false; setBusy(false); return; }
                    setAnim({ hero: "idle", enemy: "attack" });
                    return wait(360).then(function () {
                        if (cancelRef.current) { busyRef.current = false; setBusy(false); return; }
                        setAnim({ hero: "idle", enemy: "idle" });
                        var hHp2 = hpRef.current.h, eHp2 = hpRef.current.e;
                        var er = rollRound(enemy.stats, totalStats);
                        // ── KNIGHT: auto-block consumes if ready ──────────────────
                        if (knightBlockReady.current && er.dmg > 0) {
                            er.type = "block";
                            er.dmg = Math.max(1, Math.floor(er.dmg * 0.42));
                            knightBlockReady.current = false;
                            SFX.block();
                        }
                        var nHHp = Math.max(0, hHp2 - er.dmg);
                        if (nHHp <= 0 && heroPerks.indexOf("iron_will") >= 0 && !ironWillUsed.current) {
                            nHHp = 1; ironWillUsed.current = true;
                            addLog("info", "💪 Żelazna Wola! Przeżyłeś z 1 HP!");
                        }
                        var hReact = er.type === "dodge" ? "dodge" : er.type === "block" ? "block" : er.dmg > 0 ? (er.type === "crit" ? "crit" : "hit") : "idle";
                        setAnim({ hero: hReact, enemy: "idle" });
                        if (er.dmg > 0) {
                            flashPanel("hero", "red");
                            spawnFloat(er.type === "crit" ? "💥 " + er.dmg + "!" : "-" + er.dmg, "hero", er.type === "crit", er.type === "crit" ? "#ff3333" : "#ff6633");
                            if (er.type === "crit") doFlash("bigcrit");
                        }
                        if (sfxM[er.type]) sfxM[er.type]();
                        if (er.type === "hit" || er.type === "crit" || er.type === "miss")
                            showReact("enemy", "atk", er.type);
                        else if (er.type === "dodge") showReact("hero", "def", "dodge");
                        else if (er.type === "block") showReact("hero", "def", "block");
                        addLog(er.type, { miss: "❌ " + enemy.name + " chybia!", dodge: "💨 Unikasz ciosu!", block: "🛡️ Blokujesz! " + er.dmg + " przechodzi.", hit: "💢 " + enemy.name + " trafia za " + er.dmg + "!", crit: "💥 " + enemy.name + " KRYTYK za " + er.dmg + "!!!" }[er.type]);
                        if (heroPerks.indexOf("resilient") >= 0 && nHHp > 0)
                            nHHp = Math.min(heroMaxHp, nHHp + 4);
                        updHP(nHHp, eHp2);
                        return wait(490).then(function () {
                            if (cancelRef.current) {
                                busyRef.current = false;
                                setBusy(false);
                                return;
                            }
                            if (nHHp <= 0) {
                                setAnim({ hero: "dead", enemy: "idle" });
                                addLog("lose", "💀 Pokonany...");
                                SFX.lose();
                                setOutcome("lose");
                                busyRef.current = false;
                                setBusy(false);
                                return;
                            }
                            setAnim({ hero: "idle", enemy: "idle" });
                            setRound(function (r) { return r + 1; });
                            busyRef.current = false;
                            setBusy(false);
                        });
                    });
                });
            });
        });
    };
    var doHeal = function (type, baseHeal) {
        if (busy)
            return;
        var amount = getPotionHeal(baseHeal, heroPerks);
        var cur = hpRef.current, newHp = Math.min(heroMaxHp, cur.h + amount);
        updHP(newHp, cur.e);
        SFX.heal();
        flashPanel("hero", "heal");
        spawnFloat("+" + amount + " HP", "hero", false, "#44dd88");
        addLog("heal", "🧪 " + type + " potion! +" + amount + " HP");
        onUsePotion(type);
    };
    var toggleAuto = function () { setAuto(function (a) { if (!a) {
        autoRef.current = setInterval(function () { if (!busyRef.current)
            doRound(); }, 1900);
    }
    else {
        clearInterval(autoRef.current);
    } return !a; }); };
    useEffect(function () { return function () { cancelRef.current = true; clearInterval(autoRef.current); }; }, []);
    useEffect(function () { if (outcome)
        clearInterval(autoRef.current); }, [outcome]);
    var hitPct = clamp(60 + (totalStats.agi - (enemy.stats.agi || 0)) * 4 + (totalStats._hitBonus || 0), 20, 95);
    var critPct = clamp(totalStats.agi * 2 + (totalStats._critBonus || 0), 5, 50);
    var dodgePct = clamp((totalStats.agi - (enemy.stats.agi || 0)) * 3 + (totalStats._dodgeBonus || 0), 0, 32);
    var blockPct = clamp(totalStats.con * 2 + (totalStats._blockBonus || 0), 0, 28);
    return (React.createElement("div", { style: S.overlay },
        React.createElement("style", null, ANIM_CSS),
        screenFlash && React.createElement("div", { style: { position: "fixed", inset: 0, zIndex: 500, pointerEvents: "none", background: screenFlash === "bigcrit" ? "rgba(220,30,30,0.38)" : screenFlash === "crit" ? "rgba(220,80,30,0.22)" : "rgba(200,160,20,0.15)", animation: screenFlash === "bigcrit" ? "critScreen 0.6s ease" : "critScreen 0.5s ease" } }),
        React.createElement("div", { style: { padding: "7px 14px 5px", background: "linear-gradient(180deg,#1e1206,#150e04)", borderBottom: "2px solid #3e2808", flexShrink: 0 } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                React.createElement("div", { style: { fontSize: 10, color: "#7a6030", textTransform: "uppercase", letterSpacing: 2 } },
                    "\u2694\uFE0F Runda ",
                    round + 1),
                React.createElement("div", { style: { fontSize: 13, fontWeight: "bold", color: "#c8a44a", flex: 1, textAlign: "center" } }, questName),
                React.createElement("div", { style: { fontSize: 10, color: auto ? "#f0c060" : "#4a3820", minWidth: 28, textAlign: "right" } }, auto ? "AUTO" : ""))),
        React.createElement("div", { style: { display: "flex", alignItems: "flex-start", padding: "8px 10px 6px", gap: 8, flexShrink: 0 } },
            React.createElement(FighterPanel, { side: "hero", name: hero.name, emoji: CLASSES[hero.class].emoji, iconKey: classIconKey(hero.class), curHp: hp.h, maxHp: heroMaxHp, stats: totalStats, animState: anim.hero, floats: floats, flash: pf.hero, reaction: reactions.hero }),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 22, flexShrink: 0, paddingTop: 44 } },
                React.createElement("span", { style: { fontSize: 12, fontWeight: "bold", animation: "vsGlow 2.5s ease-in-out infinite", color: "#9a7020", letterSpacing: 1 } }, "VS")),
            React.createElement(FighterPanel, { side: "enemy", name: enemy.name, emoji: enemy.emoji, iconKey: enemyIconKey(enemy.name), isBoss: enemy.boss, curHp: hp.e, maxHp: initEHp.current, stats: enemy.stats, animState: anim.enemy, floats: floats, flash: pf.enemy, reaction: reactions.enemy })),
        React.createElement("div", { style: { margin: "0 10px 5px", background: "#150e04", border: "1px solid #2e1e08", borderRadius: 5, padding: "4px 8px", flexShrink: 0 } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 10, gap: 3 } }, [["Traf", hitPct + "%", "#c8a44a"], ["Kryt", critPct + "%", "#ff9944"], ["Unik", dodgePct + "%", "#44bbdd"], ["Blok", blockPct + "%", "#ddbb22"]].map(function (it) { return React.createElement("div", { key: it[0], style: { textAlign: "center", flex: 1, background: "#0d0801", borderRadius: 3, padding: "3px 0" } },
                React.createElement("div", { style: { color: "#5a4820", fontSize: 8 } }, it[0]),
                React.createElement("div", { style: { color: it[2], fontWeight: "bold" } }, it[1])); })),
            (function() {
                var prefType  = CLASSES[hero.class] && CLASSES[hero.class].preferredType;
                var weapDmg   = totalStats._weaponDmgType;
                var active    = prefType && weapDmg && prefType === weapDmg;
                var col       = active ? DMG_TYPE_COLOR[weapDmg] : "#3a2808";
                var label     = active
                    ? DMG_TYPE_LABEL[weapDmg] + " +20% DMG ✓"
                    : (prefType ? ("Equip " + DMG_TYPE_LABEL[prefType] + " for +20% DMG") : "");
                return React.createElement("div", { style: { marginTop: 3, textAlign: "center", fontSize: 8, color: col, borderTop: "1px solid #1e1208", paddingTop: 2, letterSpacing: 0.3 } }, label);
            })(),
            // ── Class ability status ────────────────────────────────────────────
            (function() {
                var cls = hero.class;
                if (cls === "knight") {
                    var nextBlock = 3 - (round % 3);
                    var ready = knightBlockReady.current;
                    return React.createElement("div", { style: { marginTop: 2, display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontSize:8, color: ready ? "#e08844" : "#3a2808", borderTop:"1px solid #1e1208", paddingTop:2 } },
                        React.createElement("span", null, ready ? "🛡 STANCE aktywny — blok gwarantowany!" : ("🛡 Stance za " + nextBlock + (nextBlock === 1 ? " rundę" : " rundy"))));
                }
                if (cls === "musketeer") {
                    var used = firstShotFired.current;
                    return React.createElement("div", { style: { marginTop:2, display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontSize:8, color: used ? "#3a2808" : "#44bbdd", borderTop:"1px solid #1e1208", paddingTop:2 } },
                        React.createElement("span", null, used ? "🎯 Pierwszy Strzał — użyty" : "🎯 Pierwszy Strzał gotowy!"));
                }
                if (cls === "alchemist") {
                    var pr2 = poisonRounds;
                    return React.createElement("div", { style: { marginTop:2, display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontSize:8, color: pr2 > 0 ? "#88ff44" : "#3a2808", borderTop:"1px solid #1e1208", paddingTop:2 } },
                        React.createElement("span", null, pr2 > 0 ? ("☠ Trucizna aktywna — " + pr2 + (pr2 === 1 ? " runda" : " rundy")) : "☠ Trucizna: 20% szans przy krytyku"));
                }
                return null;
            })()),
        React.createElement("div", { style: { padding: "0 10px 5px", display: "flex", gap: 5, flexShrink: 0, flexWrap: "wrap" } }, !outcome ? (React.createElement(React.Fragment, null,
            React.createElement("button", { onClick: doRound, disabled: busy || auto, style: { flex: 3, textAlign: "center", fontSize: 14, padding: "10px 4px", opacity: (busy || auto) ? 0.4 : 1, background: "linear-gradient(180deg,#5a3a10,#3a2208)", border: "2px solid #c8a44a", color: "#f0c060", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 6, fontWeight: "bold", boxShadow: (busy || auto) ? "none" : "0 0 8px rgba(200,164,74,0.22)" } }, "\u2694\uFE0F Atak"),
            potions.small > 0 && React.createElement("button", { onClick: function () { doHeal("small", 30); }, disabled: busy, style: { flex: 2, padding: "7px 3px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 5, fontSize: 10, textAlign: "center" } },
                "\uD83E\uDDEA ",
                getPotionHeal(30, heroPerks),
                "hp",
                React.createElement("br", null),
                React.createElement("span", { style: { fontSize: 8, color: "#2a5a2a" } },
                    "\u00D7",
                    potions.small)),
            potions.medium > 0 && React.createElement("button", { onClick: function () { doHeal("medium", 60); }, disabled: busy, style: { flex: 2, padding: "7px 3px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 5, fontSize: 10, textAlign: "center" } },
                "\u2697\uFE0F ",
                getPotionHeal(60, heroPerks),
                "hp",
                React.createElement("br", null),
                React.createElement("span", { style: { fontSize: 8, color: "#2a5a2a" } },
                    "\u00D7",
                    potions.medium)),
            potions.large > 0 && React.createElement("button", { onClick: function () { doHeal("large", 100); }, disabled: busy, style: { flex: 2, padding: "7px 3px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 5, fontSize: 10, textAlign: "center" } },
                "\uD83E\uDED9 ",
                getPotionHeal(100, heroPerks),
                "hp",
                React.createElement("br", null),
                React.createElement("span", { style: { fontSize: 8, color: "#2a5a2a" } },
                    "\u00D7",
                    potions.large)),
            React.createElement("button", { onClick: toggleAuto, style: { flex: 2, padding: "9px 3px", textAlign: "center", background: auto ? "#2a1a06" : "#1e1206", border: "1px solid " + (auto ? "#f0c060" : "#4a3210"), color: auto ? "#f0c060" : "#c8a44a", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 5, fontSize: 10 } }, auto ? "⏸ Stop" : "▶ Auto"),
            React.createElement("button", { onClick: function () { cancelRef.current = true; clearInterval(autoRef.current); onFlee(hp.h); }, style: { flex: 2, padding: "9px 3px", textAlign: "center", background: "#1e1206", border: "1px solid #5a3a2a", color: "#9a5a3a", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 5, fontSize: 10 } }, "\uD83C\uDFC3 Uciekaj"))) : (React.createElement("div", { style: { flex: 1, textAlign: "center", padding: "4px 0" } },
            React.createElement("div", { style: { fontSize: 32, margin: "2px 0 6px", filter: outcome === "win" ? "drop-shadow(0 0 12px #44dd44)" : "drop-shadow(0 0 12px #dd4444)" } }, outcome === "win" ? "🏆" : "💀"),
            React.createElement("button", { onClick: function () { if (outcome === "win")
                    onWin(hp.h);
                else
                    onLose(hp.h); }, style: { width: "100%", padding: "11px", background: "linear-gradient(180deg,#4a2e08,#2e1e06)", border: "2px solid " + (outcome === "win" ? "#44dd44" : "#dd4444"), color: outcome === "win" ? "#44dd44" : "#dd4444", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 6, fontSize: 13, fontWeight: "bold", boxShadow: "0 0 12px " + (outcome === "win" ? "rgba(68,221,68,0.3)" : "rgba(221,68,68,0.3)") } }, outcome === "win" ? "✅ Zbierz nagrody" : "💀 Odwrót")))),
        React.createElement("div", { style: { flex: 1, padding: "0 10px 12px", display: "flex", flexDirection: "column", minHeight: 100 } },
            React.createElement("div", { style: { fontSize: 10, color: "#6a5020", marginBottom: 3, textTransform: "uppercase", letterSpacing: 1, flexShrink: 0 } }, "\uD83D\uDCDC Dziennik walki"),
            React.createElement("div", { style: { flex: 1, background: "#100b03", border: "1px solid #2a1a06", borderRadius: 6, padding: "5px 9px", overflowY: "auto" } }, log.map(function (e, i) { return React.createElement("div", { key: i, style: { fontSize: 11, color: LC[e.t] || "#c8a44a", padding: "2px 0", borderBottom: i < log.length - 1 ? "1px solid #0f0902" : "none" } }, e.msg); })))));
}
// ── DUNGEON BETWEEN + REWARD ──────────────────────────────────────────────────
function DungeonBetween(props) {
    var db = props.db, maxHp = props.maxHp, potions = props.potions, perks = props.perks || [];
    var onContinue = props.onContinue, onFlee = props.onFlee, onHeal = props.onHeal;
    var section = db.dungeon.sections[db.sectionIdx];
    var hpPct = db.heroHp / maxHp * 100;
    var tp = totalPotions(potions);
    return (React.createElement("div", { style: Object.assign({}, S.overlay, { justifyContent: "center", alignItems: "center", padding: 20, textAlign: "center" }) },
        React.createElement("style", null, ANIM_CSS),
        React.createElement("div", { style: { fontSize: 11, color: "#7a6030", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 } },
            "Section ",
            db.sectionIdx,
            "/",
            db.dungeon.sections.length,
            " Cleared"),
        React.createElement("div", { style: { fontSize: 18, fontWeight: "bold", marginBottom: 10 } },
            db.dungeon.emoji,
            " ",
            db.dungeon.name),
        React.createElement("div", { style: { background: "#150e04", border: "1px solid #2e1e08", borderRadius: 8, padding: 14, marginBottom: 12, width: "100%", maxWidth: 290, boxSizing: "border-box" } },
            React.createElement("div", { style: { fontSize: 11, color: "#7a6030", marginBottom: 4 } }, "YOUR STATUS"),
            React.createElement("div", { style: { background: "#0d0801", borderRadius: 3, overflow: "hidden", height: 11, border: "1px solid #2e1e08", marginBottom: 3 } },
                React.createElement("div", { style: { width: hpPct + "%", height: "100%", background: hpPct > 55 ? "#2a8a3a" : hpPct > 28 ? "#9a8a1a" : "#9a2a2a", transition: "width 0.3s" } })),
            React.createElement("div", { style: { fontSize: 11, color: hpPct < 30 ? "#dd4444" : "#7a6030", marginBottom: tp > 0 ? 8 : 0 } },
                db.heroHp,
                "/",
                maxHp,
                " HP"),
            tp > 0 && React.createElement("div", { style: { display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" } },
                potions.small > 0 && React.createElement("button", { onClick: function () { onHeal("small", getPotionHeal(30, perks)); }, style: { padding: "5px 10px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 11 } },
                    "\uD83E\uDDEA +",
                    getPotionHeal(30, perks),
                    " (",
                    potions.small,
                    ")"),
                potions.medium > 0 && React.createElement("button", { onClick: function () { onHeal("medium", getPotionHeal(60, perks)); }, style: { padding: "5px 10px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 11 } },
                    "\u2697\uFE0F +",
                    getPotionHeal(60, perks),
                    " (",
                    potions.medium,
                    ")"),
                potions.large > 0 && React.createElement("button", { onClick: function () { onHeal("large", getPotionHeal(100, perks)); }, style: { padding: "5px 10px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 11 } },
                    "\uD83E\uDED9 +",
                    getPotionHeal(100, perks),
                    " (",
                    potions.large,
                    ")"))),
        React.createElement("div", { style: { background: "#1a0e04", border: "1px solid " + (section.boss ? "#cc4444" : "#3e2808"), borderRadius: 8, padding: 10, marginBottom: 14, width: "100%", maxWidth: 290, boxSizing: "border-box", animation: section.boss ? "bossPulse 1.4s ease-in-out infinite" : "" } },
            React.createElement("div", { style: { fontSize: 11, color: section.boss ? "#cc4444" : "#7a6030", marginBottom: 3 } }, section.boss ? "⚠️ BOSS FIGHT" : "NEXT SECTION"),
            React.createElement("div", { style: { display:"flex", justifyContent:"center", margin:"4px 0 6px" } },
                React.createElement("div", { style: { width:40, height:40, background:"#0d0801", borderRadius:7, border:"1px solid "+(section.boss?"#cc4444":"#3e2808"), display:"flex", alignItems:"center", justifyContent:"center" } },
                    React.createElement(PixelIcon, { name: enemyIconKey(section.enemy.name), size: 32, fallback: section.enemy.emoji }))),
            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13 } },
                section.name,
                ": ",
                section.enemy.name),
            React.createElement("div", { style: { fontSize: 11, color: "#9a7030" } },
                "HP ",
                section.enemy.hp)),
        React.createElement("div", { style: { display: "flex", gap: 10, width: "100%", maxWidth: 290 } },
            React.createElement("button", { onClick: function () { SFX.enter(); onContinue(); }, style: Object.assign({}, S.bigBtn, { flex: 2, textAlign: "center", fontSize: 13, padding: "9px" }) }, "Continue \u2192"),
            React.createElement("button", { onClick: onFlee, style: { flex: 1, padding: "9px", background: "#1e1206", border: "1px solid #5a3a2a", color: "#9a5a3a", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 5, fontSize: 12 } }, "\uD83C\uDFC3 Flee"))));
}
function DungeonReward(props) {
    var dr = props.dr, onClaim = props.onClaim;
    var rarity = dr.loot.rarity;
    var rarAnim = rarity === "legendary" ? "legendaryPulse 2s ease-in-out infinite" : rarity === "epic" ? "epicPulse 2s ease-in-out infinite" : "rarePulse 2s ease-in-out infinite";
    return (React.createElement("div", { style: Object.assign({}, S.overlay, { justifyContent: "center", alignItems: "center", padding: 20, textAlign: "center" }) },
        React.createElement("style", null, ANIM_CSS),
        React.createElement("div", { style: { fontSize: 34, marginBottom: 5 } }, "\uD83C\uDFC6"),
        React.createElement("div", { style: { fontSize: 19, fontWeight: "bold", marginBottom: 2 } }, "Dungeon Cleared!"),
        React.createElement("div", { style: { fontSize: 12, color: "#7a6030", marginBottom: 14 } },
            dr.dungeon.emoji,
            " ",
            dr.dungeon.name),
        React.createElement("div", { style: { background: "#150e04", border: "2px solid " + RARITY_COLOR[rarity], borderRadius: 10, padding: 14, marginBottom: 12, maxWidth: 270, width: "100%", boxSizing: "border-box", animation: rarAnim, boxShadow: RARITY_GLOW[rarity] } },
            React.createElement("div", { style: { fontSize: 10, color: RARITY_COLOR[rarity], textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 } },
                rarity,
                " item"),
            React.createElement("div", { style: { display:"flex", justifyContent:"center", marginBottom: 8 } },
                React.createElement("div", { style: { width:52, height:52, background:"#0d0801", borderRadius:10, border:"2px solid "+RARITY_COLOR[rarity], boxShadow: RARITY_GLOW[rarity], display:"flex", alignItems:"center", justifyContent:"center" } },
                    React.createElement(PixelIcon, { name: dr.loot.id, size: 38, fallback: SLOT_EMOJI[dr.loot.slot] }))),
            React.createElement("div", { style: { fontSize: 14, fontWeight: "bold", color: RARITY_COLOR[rarity], marginBottom: 3 } }, dr.loot.name),
            React.createElement("div", { style: { fontSize: 11, color: "#7a6030", marginBottom: 4 } }, dr.loot.desc),
            React.createElement("div", { style: { fontSize: 11, color: "#c8a44a" } }, Object.keys(dr.loot.stats).map(function (k) { return "+" + dr.loot.stats[k] + " " + k.toUpperCase(); }).join(" · "))),
        React.createElement("div", { style: { display: "flex", gap: 14, fontSize: 13, color: "#c8a44a", marginBottom: 14 } },
            React.createElement("span", null,
                "\u2728 +",
                dr.xpG,
                " XP"),
            React.createElement("span", null,
                "\uD83D\uDCB0 +",
                dr.goldG,
                "g")),
        React.createElement("button", { onClick: onClaim, style: Object.assign({}, S.bigBtn, { width: "100%", maxWidth: 270, textAlign: "center", borderColor: "#44dd44", color: "#44dd44", fontSize: 14 }) }, "\u2705 Claim Rewards")));
}
// ── LEVEL UP OVERLAY ──────────────────────────────────────────────────────────
function LevelUpOverlay(props) {
    var luInfo = props.luInfo, hero = props.hero, onConfirm = props.onConfirm;
    var choices = luInfo.perkChoices;
    var _sel = useState(null);
    var sel = _sel[0];
    var setSel = _sel[1];
    var _alloc = useState({ str: 0, agi: 0, int: 0, con: 0 });
    var alloc = _alloc[0];
    var setAlloc = _alloc[1];
    var total = luInfo.points;
    var spent = alloc.str + alloc.agi + alloc.int + alloc.con;
    var left = total - spent;
    var canDone = left === 0 && (choices === null || choices.length === 0 || sel !== null);
    var adj = function (stat, d) { setAlloc(function (prev) { var n = Object.assign({}, prev); n[stat] = Math.max(0, (n[stat] || 0) + d); if (n.str + n.agi + n.int + n.con > total)
        return prev; return n; }); };
    var confirm = function () { if (!canDone)
        return; SFX.lvlUp(); onConfirm({ perkId: sel, statBonuses: alloc }); };
    return (React.createElement("div", { style: Object.assign({}, S.overlay, { zIndex: 300, justifyContent: "flex-start", alignItems: "center", padding: "20px 14px", overflowY: "auto" }) },
        React.createElement("style", null, ANIM_CSS),
        React.createElement("div", { style: { textAlign: "center", marginBottom: 14, width: "100%", maxWidth: 340, animation: "lvlFlash 0.5s ease" } },
            React.createElement("div", { style: { fontSize: 11, color: "#7a6030", textTransform: "uppercase", letterSpacing: 2 } }, "\u2B06\uFE0F Level Up!"),
            React.createElement("div", { style: { fontSize: 22, fontWeight: "bold", color: "#f0c060", marginTop: 2 } },
                "Level ",
                luInfo.level)),
        choices && choices.length > 0 && (React.createElement("div", { style: { width: "100%", maxWidth: 340, marginBottom: 14 } },
            React.createElement("div", { style: S.sec }, "\u2728 Choose a Perk"),
            React.createElement("div", { style: { display: "flex", gap: 7 } }, choices.map(function (pid) {
                var p = PERKS.find(function (x) { return x.id === pid; });
                if (!p)
                    return null;
                var isSel = sel === pid;
                return (React.createElement("div", { key: pid, onClick: function () { setSel(pid); SFX.perk(); }, style: { flex: 1, padding: 9, background: isSel ? "#1e1508" : "#150e04", border: "2px solid " + (isSel ? "#c8a44a" : "#2e1e08"), borderRadius: 8, cursor: "pointer", textAlign: "center", transition: "all 0.15s", minWidth: 0 } },
                    React.createElement("div", { style: { fontSize: 22, marginBottom: 3 } }, p.emoji),
                    React.createElement("div", { style: { fontSize: 11, fontWeight: "bold", color: isSel ? "#f0c060" : "#c8a44a", marginBottom: 2, lineHeight: 1.2 } }, p.name),
                    React.createElement("div", { style: { fontSize: 9, color: "#7a6030", lineHeight: 1.3 } }, p.desc)));
            })))),
        React.createElement("div", { style: { width: "100%", maxWidth: 340, marginBottom: 14 } },
            React.createElement("div", { style: S.sec },
                "\uD83D\uDCCA Attribute Points ",
                React.createElement("span", { style: { color: left > 0 ? "#f0c060" : "#44dd88", fontSize: 12 } },
                    "(",
                    left,
                    " left)")),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } }, ["str", "agi", "int", "con"].map(function (stat) {
                var label = STAT_LABEL[stat], base = hero.stats[stat] || 0, bonus = alloc[stat] || 0, sc = STAT_COLOR[stat];
                return (React.createElement("div", { key: stat, style: { background: "#0d0801", border: "1px solid " + sc + "33", borderRadius: 6, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 } },
                    React.createElement("div", { style: { flex: 1 } },
                        React.createElement("div", { style: { fontSize: 10, color: sc + "aa" } }, label),
                        React.createElement("div", { style: { fontSize: 18, fontWeight: "bold", color: sc } },
                            base + bonus,
                            bonus > 0 && React.createElement("span", { style: { fontSize: 11, color: "#44dd88" } },
                                " +",
                                bonus))),
                    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 3 } },
                        React.createElement("button", { onClick: function () { adj(stat, 1); }, disabled: left <= 0, style: { background: "#2a1a06", border: "1px solid " + sc, color: sc, width: 22, height: 22, borderRadius: 3, cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 14, opacity: left > 0 ? 1 : 0.35 } }, "+"),
                        React.createElement("button", { onClick: function () { adj(stat, -1); }, disabled: bonus <= 0, style: { background: "#1e1206", border: "1px solid #4a3210", color: "#9a7030", width: 22, height: 22, borderRadius: 3, cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 14, opacity: bonus > 0 ? 1 : 0.35 } }, "\u2212"))));
            }))),
        React.createElement("button", { onClick: confirm, disabled: !canDone, style: Object.assign({}, S.bigBtn, { width: "100%", maxWidth: 340, textAlign: "center", fontSize: 14, opacity: canDone ? 1 : 0.4, borderColor: canDone ? "#44dd44" : "#c8a44a", color: canDone ? "#44dd44" : "#c8a44a" }) }, canDone ? "✅ Confirm" : (sel === null && choices && choices.length > 0 ? "← Select a perk first" : "Allocate all points"))));
}
