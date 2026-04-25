function HeroTab(props) {
    var hero = props.hero, equipped = props.equipped, stats = props.stats, potions = props.potions;
    var onUnequip = props.onUnequip, onHeal = props.onHeal, onInstantHeal = props.onInstantHeal;
    var hpPct = hero.hp / hero.maxHp * 100;
    var xpPct = hero.xp / hero.xpNeeded * 100;
    var perks = hero.perks || [];
    var _hov = useState(null);
    var hovPerk = _hov[0];
    var setHovPerk = _hov[1];
    // Stat tooltips (hover on desktop, tap on mobile; auto-hide after 4s)
    var _st = useState(null);
    var hovStat = _st[0];
    var setHovStat = _st[1];
    var statTipTimer = useRef(null);
    function statTipText(st) {
        if (st === "str")
            return "⚔️ STR (Siła): Zwiększa obrażenia zadawane bronią białą oraz siłę blokowania ataków.";
        if (st === "agi")
            return "🏃 AGI (Zręczność): Zwiększa szansę na trafienie, unik i inicjatywę w walce.";
        if (st === "int")
            return "🧠 INT (Inteligencja): Zwiększa obrażenia od prochu, granatów i alchemii oraz szansę na trafienie krytyczne.";
        if (st === "con")
            return "❤️ CON (Wytrzymałość): Zwiększa maksymalne punkty życia oraz ogólną odporność na obrażenia.";
        return "";
    }
    function statAbbr(st) {
        if (st === "str")
            return "STR";
        if (st === "agi")
            return "AGI";
        if (st === "int")
            return "INT";
        if (st === "con")
            return "CON";
        return st.toUpperCase();
    }
    function toggleStatTip(st) {
        clearTimeout(statTipTimer.current);
        setHovStat(function (cur) { return cur === st ? null : st; });
        statTipTimer.current = setTimeout(function () { setHovStat(null); }, 4000);
    }
    useEffect(function () { return function () { clearTimeout(statTipTimer.current); }; }, []);
    return (React.createElement("div", null,
        React.createElement("div", { style: S.card },
            React.createElement("div", { style: { textAlign: "center", marginBottom: 10 } },
                React.createElement("div", { style: { marginBottom: 6, display: "flex", justifyContent: "center" } },
                    React.createElement(CharSprite, { iconKey: classIconKey(hero.class), emoji: CLASSES[hero.class].emoji, size: 72 })),
                React.createElement("div", { style: { fontSize: 17, fontWeight: "bold" } }, hero.name),
                React.createElement("div", { style: { color: "#7a6030", fontSize: 11, marginBottom: 8 } },
                    CLASSES[hero.class].name,
                    " \u00B7 Poziom ",
                    hero.level),
                React.createElement("div", { style: { marginBottom: 6 } },
                    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 9, color: "#5a4820", marginBottom: 2 } },
                        React.createElement("span", null, "\u2764\uFE0F HP"),
                        React.createElement("span", { style: { color: hpPct < 30 ? "#dd4444" : "#7a6030" } },
                            hero.hp,
                            " / ",
                            hero.maxHp)),
                    React.createElement(HpBar, { pct: hpPct, height: 12 })),
                React.createElement("div", null,
                    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 9, color: "#5a4820", marginBottom: 2 } },
                        React.createElement("span", null, "\u2728 XP"),
                        React.createElement("span", null,
                            hero.xp,
                            " / ",
                            hero.xpNeeded)),
                    React.createElement("div", { style: { background: "#0a0604", borderRadius: 4, overflow: "hidden", height: 10, border: "1px solid #2e1e08", position: "relative" } },
                        React.createElement("div", { style: { width: xpPct + "%", height: "100%", background: "linear-gradient(90deg,#5a3808,#e0b040,#f8d060)", transition: "width 0.5s", position: "relative", overflow: "hidden" } },
                            React.createElement("div", { style: { position: "absolute", top: 0, left: 0, height: "100%", width: "30%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)", animation: "xpShine 2.8s ease-in-out infinite" } })))),
                React.createElement("div", { style: { display: "flex", gap: 6, justifyContent: "center", marginTop: 8, flexWrap: "wrap" } },
                    totalPotions(potions) > 0 && hero.hp < hero.maxHp && (React.createElement(React.Fragment, null,
                        potions.small > 0 && React.createElement("button", { onClick: function () { onHeal("small", getPotionHeal(30, perks)); }, style: { padding: "4px 9px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10 } },
                            "\uD83E\uDDEA +",
                            getPotionHeal(30, perks),
                            " (",
                            potions.small,
                            ")"),
                        potions.medium > 0 && React.createElement("button", { onClick: function () { onHeal("medium", getPotionHeal(60, perks)); }, style: { padding: "4px 9px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10 } },
                            "\u2697\uFE0F +",
                            getPotionHeal(60, perks),
                            " (",
                            potions.medium,
                            ")"),
                        potions.large > 0 && React.createElement("button", { onClick: function () { onHeal("large", getPotionHeal(100, perks)); }, style: { padding: "4px 9px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10 } },
                            "\uD83E\uDED9 +",
                            getPotionHeal(100, perks),
                            " (",
                            potions.large,
                            ")"))),
                    React.createElement("button", { onClick: onInstantHeal, style: { padding: "4px 9px", background: "#1e1a06", border: "1px solid #aa7000", color: "#ffaa00", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10 } }, "\u26A1 Full Heal [\u03B1]"))),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 } }, ["str", "agi", "int", "con"].map(function (st) {
                var sc = STAT_COLOR[st];
                var isH = hovStat === st;
                return (React.createElement("div", { key: st, style: { position: "relative" }, onMouseEnter: function () { setHovStat(st); }, onMouseLeave: function () { setHovStat(null); }, onTouchStart: function (e) { e.preventDefault(); toggleStatTip(st); } },
                    React.createElement("div", { style: { background: "linear-gradient(180deg,#0f0a02,#0b0701)", border: "1px solid " + (isH ? "#c8a44a" : sc + "33"), borderRadius: 10, padding: "10px 8px", textAlign: "center", boxShadow: isH ? "0 10px 22px rgba(0,0,0,0.65), 0 0 16px rgba(200,164,74,0.16), inset 0 0 14px " + sc + "10" : "0 8px 18px rgba(0,0,0,0.55), inset 0 0 12px " + sc + "0a", transition: "transform .12s ease, box-shadow .12s ease, border-color .12s ease", cursor: "help", userSelect: "none" } },
                        React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", justifyContent: "center", color: isH ? "#f0c060" : sc + "aa", fontSize: 10, letterSpacing: 0.45, textTransform: "uppercase" } },
                            // PIXEL ART ICONS
                            React.createElement(PixelIcon, { name: st, size: 24 }),
                            React.createElement("span", null, statAbbr(st))),
                        React.createElement("div", { style: { fontSize: 22, fontWeight: "bold", color: sc, textShadow: "0 0 10px " + sc + "44" } }, stats[st] || 0),
                        React.createElement("div", { style: { height: 6 } })),
                    isH && React.createElement("div", { className: "ps-tip" },
                        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#f0c060", fontWeight: "bold", marginBottom: 4, letterSpacing: 0.3 } },
                            // PIXEL ART ICONS
                            React.createElement(PixelIcon, { name: st, size: 20 }),
                            React.createElement("span", null, statAbbr(st))),
                        React.createElement("div", { style: { fontSize: 10.5, color: "#c8a44a", lineHeight: 1.35 } }, statTipText(st)))));
            })),
            (potions.small > 0 || potions.medium > 0 || potions.large > 0) && React.createElement("div", { style: { marginTop: 7, background: "#0d0801", border: "1px solid #2e1e08", borderRadius: 5, padding: "5px 8px", display: "flex", gap: 10, justifyContent: "center" } },
                potions.small > 0 && React.createElement("span", { style: { fontSize: 11, color: "#44dd88" } },
                    "\uD83E\uDDEA\u00D7",
                    potions.small),
                potions.medium > 0 && React.createElement("span", { style: { fontSize: 11, color: "#44dd88" } },
                    "\u2697\uFE0F\u00D7",
                    potions.medium),
                potions.large > 0 && React.createElement("span", { style: { fontSize: 11, color: "#44dd88" } },
                    "\uD83E\uDED9\u00D7",
                    potions.large))),
        perks.length > 0 && React.createElement("div", { style: S.card },
            React.createElement("div", { style: S.sec },
                "\u2728 Perki (",
                perks.length,
                ")"),
            React.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap" } }, perks.map(function (pid) {
                var p = PERKS.find(function (x) { return x.id === pid; });
                if (!p)
                    return null;
                var isH = hovPerk === pid;
                return (React.createElement("div", { key: pid, style: { position: "relative" }, onMouseEnter: function () { setHovPerk(pid); }, onMouseLeave: function () { setHovPerk(null); }, onTouchStart: function () { setHovPerk(isH ? null : pid); } },
                    React.createElement("div", { style: { padding: "4px 10px", background: isH ? "#2a1e0a" : "#1a1208", border: "1px solid " + (isH ? "#c8a44a" : "#3a2808"), borderRadius: 5, fontSize: 11, color: isH ? "#f0c060" : "#c8a44a", cursor: "default", transition: "all 0.15s", boxShadow: isH ? "0 0 8px rgba(200,164,74,0.18)" : "none" } },
                        p.emoji,
                        " ",
                        p.name),
                    isH && React.createElement("div", { style: { position: "absolute", bottom: "110%", left: "50%", transform: "translateX(-50%)", background: "#1e1508", border: "1px solid #c8a44a", borderRadius: 7, padding: "8px 11px", zIndex: 100, width: 160, textAlign: "center", boxShadow: "0 4px 18px rgba(0,0,0,0.7)", pointerEvents: "none" } },
                        React.createElement("div", { style: { fontSize: 20, marginBottom: 3 } }, p.emoji),
                        React.createElement("div", { style: { fontSize: 12, fontWeight: "bold", color: "#f0c060", marginBottom: 3 } }, p.name),
                        React.createElement("div", { style: { fontSize: 10, color: "#9a8040", lineHeight: 1.35 } }, p.desc),
                        React.createElement("div", { style: { position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #c8a44a" } }))));
            }))),
        React.createElement("div", { style: S.sec }, "\uD83C\uDFBD Ekwipunek"),
        Object.keys(SLOT_EMOJI).map(function (slot) { var it = equipped[slot]; return React.createElement("div", { key: slot, style: Object.assign({}, S.row, { opacity: it ? 1 : 0.45 }) },
            // PIXEL ART ICONS
            React.createElement(PixelIcon, { name: slot, size: 24, style: it ? {} : { opacity: 0.45, filter: "grayscale(1) brightness(0.85) drop-shadow(0 1px 2px rgba(0,0,0,0.6))" } }),
            React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 12, color: it && it.rarity ? RARITY_COLOR[it.rarity] : "#c8a44a" } }, it ? it.name : "Empty " + slot),
                it && React.createElement("div", { style: { color: "#7a6030", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, it.desc),
                it && React.createElement("div", { style: { fontSize: 10, color: it.rarity ? RARITY_COLOR[it.rarity] : "#c8a44a", marginTop: 1 } }, Object.keys(it.stats).map(function (s) { return "+" + it.stats[s] + " " + s.toUpperCase(); }).join(" · "))),
            it && React.createElement("button", { onClick: function () { onUnequip(slot); }, style: S.btn }, "Remove")); })));
}
// ── QUESTS TAB ────────────────────────────────────────────────────────────────
function QuestsTab(props) {
    var quests = props.quests, questLog = props.questLog, onStart = props.onStart;
    var stamina = props.stamina || 0, activeJob = props.activeJob;
    var _open = useState(false);
    var logOpen = _open[0];
    var setLogOpen = _open[1];
    return (React.createElement("div", null,
        React.createElement("div", { style: S.sec }, T("Dostępne Questy", "Available Quests")),
        activeJob && React.createElement("div", { style: { background: "#1a1206", border: "1px solid #f0c06044", borderRadius: 7, padding: "8px 12px", marginBottom: 10, fontSize: 11, color: "#f0c060" } },
            "\uD83D\uDCBC ",
            T("Jesteś w pracy — questy niedostępne.", "You are working — quests unavailable.")),
        quests.map(function (q) {
            var en = QUEST_ENEMIES[q.id];
            var diff = getQuestDiff(q.minLevel);
            var cost = getStaminaCost(q);
            var canGo = !activeJob && stamina >= cost;
            return React.createElement("div", { key: q.id, style: Object.assign({}, S.card, { borderColor: diff.color + "44", opacity: canGo ? 1 : 0.65, animation: diff.pulse && canGo ? "bossPulse 1.5s ease-in-out infinite" : "" }) },
                React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "flex-start" } },
                    React.createElement("div", { style: { flex: 1 } },
                        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 2, flexWrap: "wrap" } },
                            React.createElement("span", { style: { fontWeight: "bold", fontSize: 13 } }, q.name),
                            React.createElement("span", { style: { fontSize: 9, padding: "1px 6px", background: diff.bg, border: "1px solid " + diff.color, borderRadius: 10, color: diff.color, letterSpacing: 0.5 } }, diff.label),
                            React.createElement("span", { style: { fontSize: 9, color: stamina >= cost ? "#44aaff" : "#dd4444", background: "#0a0c14", border: "1px solid #1e2a3a", borderRadius: 8, padding: "1px 5px" } },
                                "\u26A1 ",
                                cost)),
                        React.createElement("div", { style: { color: "#7a6030", fontSize: 10, margin: "2px 0 3px" } }, q.desc),
                        React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 3 } },
                            React.createElement("div", { style: { width:28, height:28, background:"#0d0801", borderRadius:5, border:"1px solid #2e1e08", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 } },
                                React.createElement(PixelIcon, { name: enemyIconKey(en.name), size: 22, fallback: en.emoji })),
                            React.createElement("span", { style: { fontSize: 10, color: "#9a7030" } },
                                React.createElement("strong", null, en.name),
                                " \u00B7 HP ",
                                en.hp)),
                        React.createElement("div", { style: { fontSize: 10, display: "flex", gap: 8, flexWrap: "wrap", color: "#a08040" } },
                            React.createElement("span", null,
                                "\uD83D\uDEB6 ",
                                q.travel,
                                "s"),
                            React.createElement("span", null,
                                "\u2728 ",
                                q.xp,
                                " XP"),
                            React.createElement("span", null,
                                "\uD83D\uDCB0 ",
                                q.gold[0],
                                "-",
                                q.gold[1],
                                "g"),
                            React.createElement("span", null,
                                "\uD83C\uDF81 ",
                                Math.floor(q.lootChance * 100),
                                "%"))),
                    React.createElement("div", { style: { flexShrink: 0, marginTop: 2, textAlign: "center" } },
                        React.createElement("button", { onClick: function () { if (canGo)
                                onStart(q); }, disabled: !canGo, style: Object.assign({}, S.bigBtn, { fontSize: 11, padding: "7px 10px", borderColor: canGo ? diff.color : "#4a3a1a", color: canGo ? diff.color : "#4a3a1a", opacity: canGo ? 1 : 0.4 }) },
                            "\u2694\uFE0F ",
                            T("Idź!", "Go!")),
                        !activeJob && stamina < cost && React.createElement("div", { style: { fontSize: 8, color: "#dd4444", marginTop: 2 } },
                            "\u26A1 ",
                            T("Brak staminy", "Low stamina")))));
        }),
        questLog.length > 0 && React.createElement("div", null,
            React.createElement("button", { onClick: function () { setLogOpen(function (o) { return !o; }); }, style: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "6px 0", fontFamily: "Georgia,serif", width: "100%" } },
                React.createElement("div", { style: Object.assign({}, S.sec, { marginBottom: 0, flex: 1, borderBottom: "none", paddingBottom: 0 }) },
                    "\uD83D\uDCDC ",
                    T("Dziennik Questów", "Quest Log"),
                    " (",
                    questLog.length,
                    ")"),
                React.createElement("span", { style: { fontSize: 11, color: "#7a6030" } }, logOpen ? T("▲ ukryj", "▲ hide") : T("▼ pokaż", "▼ show"))),
            React.createElement("div", { style: { borderBottom: "1px solid #2e1e08", marginBottom: 9 } }),
            logOpen && questLog.map(function (e, i) { return React.createElement("div", { key: i, style: Object.assign({}, S.row, { padding: "6px 10px", fontSize: 11 }) },
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("strong", null, e.quest),
                    " \u00B7 +",
                    e.xp,
                    " XP \u00B7 +",
                    e.gold,
                    "g",
                    e.loot ? " · 🎁 " + e.loot : ""),
                React.createElement("span", { style: { color: "#4a3a1a", fontSize: 10 } }, e.time)); }))));
}
// ── INVENTORY TAB ─────────────────────────────────────────────────────────────
function InventoryTab(props) {
    var inventory = props.inventory, onEquip = props.onEquip, onSell = props.onSell;
    var hero = props.hero, potions = props.potions, onHeal = props.onHeal;
    var perks = hero ? hero.perks || [] : [];
    var tp = totalPotions(potions);
    if (!inventory.length && tp === 0)
        return React.createElement("div", { style: { textAlign: "center", color: "#7a6030", padding: "50px 20px" } },
            React.createElement("div", { style: { fontSize: 42 } }, "\uD83C\uDF92"),
            React.createElement("div", { style: { marginTop: 8 } }, T("Torba pusta. Idź kogoś pobić!", "Inventory empty. Go fight someone!")));
    return (React.createElement("div", null,
        tp > 0 && hero && hero.hp < hero.maxHp && (React.createElement("div", { style: { background: "#0a1e0a", border: "1px solid #2a6a2a", borderRadius: 8, padding: "10px 12px", marginBottom: 10 } },
            React.createElement("div", { style: { fontSize: 11, color: "#3a8a3a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 7 } }, "\uD83E\uDDEA Use Potion"),
            React.createElement("div", { style: { display: "flex", gap: 7, flexWrap: "wrap" } },
                potions.small > 0 && React.createElement("button", { onClick: function () { onHeal("small", getPotionHeal(30, perks)); }, style: { padding: "6px 12px", background: "#0d2a0d", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 12 } },
                    "\uD83E\uDDEA +",
                    getPotionHeal(30, perks),
                    " HP (",
                    potions.small,
                    ")"),
                potions.medium > 0 && React.createElement("button", { onClick: function () { onHeal("medium", getPotionHeal(60, perks)); }, style: { padding: "6px 12px", background: "#0d2a0d", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 12 } },
                    "\u2697\uFE0F +",
                    getPotionHeal(60, perks),
                    " HP (",
                    potions.medium,
                    ")"),
                potions.large > 0 && React.createElement("button", { onClick: function () { onHeal("large", getPotionHeal(100, perks)); }, style: { padding: "6px 12px", background: "#0d2a0d", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 12 } },
                    "\uD83E\uDED9 +",
                    getPotionHeal(100, perks),
                    " HP (",
                    potions.large,
                    ")")))),
        inventory.length > 0 && React.createElement("div", { style: S.sec },
            "\uD83C\uDF92 Items (",
            inventory.length,
            ")"),
        inventory.map(function (it) {
            var col = it.rarity ? RARITY_COLOR[it.rarity] : TIER_COLOR[it.tier] || "#c8a44a";
            var tLabel = it.rarity ? it.rarity.toUpperCase() : ("★".repeat(it.tier || 1));
            var leftBorder = it.rarity ? RARITY_COLOR[it.rarity] : (TIER_COLOR[it.tier] || "#4a3a1a");
            return React.createElement("div", { key: it.uid, style: Object.assign({}, S.row, { boxShadow: it.rarity ? RARITY_GLOW[it.rarity] : "none", borderLeft: "3px solid " + leftBorder }) },
                React.createElement("div", { style: { width: 36, height: 36, flexShrink: 0, display:"flex", alignItems:"center", justifyContent:"center", background:"#0d0801", borderRadius:6, border:"1px solid " + leftBorder + "66" } },
                    React.createElement(PixelIcon, { name: it.id, size: 26, fallback: SLOT_EMOJI[it.slot] })),
                React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 12, color: col } },
                        it.name,
                        " ",
                        React.createElement("span", { style: { fontSize: 9 } }, tLabel)),
                    React.createElement("div", { style: { color: "#7a6030", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, it.desc),
                    ItemBadges(it),
                    React.createElement("div", { style: { fontSize: 10, color: col, marginTop: 1 } }, Object.keys(it.stats).map(function (s) { return "+" + it.stats[s] + " " + s.toUpperCase(); }).join(" · "))),
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 } },
                    React.createElement("button", { onClick: function () { onEquip(it); }, style: S.btn }, "Equip"),
                    React.createElement("button", { onClick: function () { SFX.sell(); onSell(it); }, style: Object.assign({}, S.btn, { color: "#f0c060", borderColor: "#5a4810" }) },
                        "\uD83D\uDCB0 ",
                        getSellPrice(it),
                        "g"))); })));
}
// ── SHOP TAB ──────────────────────────────────────────────────────────────────
function ShopTab(props) {
    var items = props.items || ITEMS, gold = props.gold, potions = props.potions, onBuy = props.onBuy, onBuyPotion = props.onBuyPotion;
    var shopPool = props.shopPool, setShopPool = props.setShopPool, shopSpecial = props.shopSpecial, setShopSpecial = props.setShopSpecial, shopRefreshAt = props.shopRefreshAt, setShopRefreshAt = props.setShopRefreshAt;
    var heroClass = props.heroClass, equipped = props.equipped || {};
    // ── StatDiff: show +/- vs currently equipped item in same slot ─────────────
    function StatDiff(it) {
        var cur = equipped[it.slot];
        if (!cur) return null;
        var allKeys = Array.from(new Set(Object.keys(it.stats).concat(Object.keys(cur.stats))));
        var diffs = allKeys.map(function(k) {
            var delta = (it.stats[k] || 0) - (cur.stats[k] || 0);
            return delta !== 0 ? { k: k, delta: delta } : null;
        }).filter(Boolean);
        if (!diffs.length) return null;
        return React.createElement("div", { style: { display:"flex", gap:3, flexWrap:"wrap", marginTop:2 } },
            diffs.map(function(d) {
                var col = d.delta > 0 ? "#44dd88" : "#ff6655";
                var sign = d.delta > 0 ? "+" : "";
                return React.createElement("span", { key:d.k, style:{ fontSize:8, color:col, background:"#0d0801", border:"1px solid "+col+"44", borderRadius:3, padding:"1px 4px" } },
                    sign + d.delta + " " + d.k.toUpperCase());
            }));
    }
    var REFRESH_MS = 15 * 60 * 1000;
    var _tick = useState(0);
    var setTick = _tick[1];
    var _f = useState("all");
    var filter = _f[0];
    var setFilter = _f[1];
    useEffect(function () { var cdLeft = shopRefreshAt ? Math.max(0, shopRefreshAt + REFRESH_MS - Date.now()) : 0; if (!cdLeft)
        return; var id = setInterval(function () { setTick(function (n) { return n + 1; }); }, 1000); return function () { clearInterval(id); }; }, [shopRefreshAt]);
    useEffect(function () { if (!shopPool)
        doRefresh(false); }, []);
    function doRefresh(withSound) {
        var sh = items.slice().sort(function () { return Math.random() - 0.5; });
        setShopPool(sh.slice(0, 9));
        var roll = Math.random();
        var rarity = roll < 0.02 ? "legendary" : roll < 0.1 ? "epic" : roll < 0.33 ? "rare" : null;
        var sp = null;
        if (rarity) {
            var sP = DUNGEON_ITEMS.filter(function (i) { return i.rarity === rarity; });
            var it = sP[rng(0, sP.length - 1)];
            var mult = rarity === "legendary" ? 2.5 : rarity === "epic" ? 2.2 : 2.0;
            sp = Object.assign({}, it, { shopPrice: Math.floor(it.sellPrice * mult) });
            if (withSound)
                setTimeout(SFX.rareItem, 300);
        }
        setShopSpecial(sp);
        setShopRefreshAt(Date.now());
    }
    var cdLeft = shopRefreshAt ? Math.max(0, shopRefreshAt + REFRESH_MS - Date.now()) : 0;
    var canRefresh = cdLeft <= 0;
    var displayPool = shopPool || items.slice(0, 9);
    var slots = ["all", "weapon", "helmet", "armor", "boots", "accessory"];
    var filtered = filter === "myclass"
        ? displayPool.filter(function (i) { return !i.classTag || i.classTag === heroClass; })
        : filter === "all" ? displayPool : displayPool.filter(function (i) { return i.slot === filter; });
    var ctInfo = heroClass && CLASS_TAG_INFO[heroClass];
    return (React.createElement("div", null,
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 9, background: "#150e04", border: "1px solid #2e1e08", borderRadius: 6, padding: "6px 10px" } },
            React.createElement("div", { style: { flex: 1, fontSize: 11, color: canRefresh ? "#44dd88" : "#7a6030" } }, canRefresh ? "✅ Nowy towar dostępny!" : "⏳ Restockuje za " + fmtCooldown(cdLeft)),
            React.createElement("button", { onClick: function () { if (canRefresh) {
                    SFX.buy();
                    doRefresh(true);
                } }, disabled: !canRefresh, style: { padding: "4px 9px", background: canRefresh ? "#0a2a0a" : "#1e1206", border: "1px solid " + (canRefresh ? "#2a6a2a" : "#4a3210"), color: canRefresh ? "#44dd88" : "#7a6030", fontFamily: "Georgia,serif", cursor: canRefresh ? "pointer" : "default", borderRadius: 4, fontSize: 11, opacity: canRefresh ? 1 : 0.6 } }, "\uD83D\uDD04 Od\u015Bwie\u017C"),
            React.createElement("button", { onClick: function () { SFX.buy(); doRefresh(true); }, style: { padding: "4px 7px", background: "#1e1a06", border: "1px solid #aa7000", color: "#ffaa00", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10 } }, "\u26A1[\u03B1]")),
        shopSpecial && React.createElement("div", { style: { background: "#150e04", border: "2px solid " + RARITY_COLOR[shopSpecial.rarity], borderRadius: 8, padding: 10, marginBottom: 10, boxShadow: RARITY_GLOW[shopSpecial.rarity] } },
            React.createElement("div", { style: { fontSize: 10, color: RARITY_COLOR[shopSpecial.rarity], textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 } },
                "\u2605 Rzadka Oferta \u2014 ",
                shopSpecial.rarity),
            React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } },
                React.createElement("div", { style: { width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", background:"#0d0801", borderRadius:6, border:"2px solid " + RARITY_COLOR[shopSpecial.rarity], boxShadow: RARITY_GLOW[shopSpecial.rarity] } },
                    React.createElement(PixelIcon, { name: shopSpecial.id, size: 28, fallback: SLOT_EMOJI[shopSpecial.slot] })),
                React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 12, color: RARITY_COLOR[shopSpecial.rarity] } }, shopSpecial.name),
                    React.createElement("div", { style: { color: "#7a6030", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, shopSpecial.desc),
                    React.createElement("div", { style: { fontSize: 10, color: RARITY_COLOR[shopSpecial.rarity], marginTop: 1 } }, Object.keys(shopSpecial.stats).map(function (s) { return "+" + shopSpecial.stats[s] + " " + s.toUpperCase(); }).join(" · "))),
                React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
                    React.createElement("div", { style: { fontSize: 11, color: "#f0c060", marginBottom: 3 } },
                        "\uD83D\uDCB0 ",
                        shopSpecial.shopPrice),
                    React.createElement("button", { onClick: function () { if (gold >= shopSpecial.shopPrice) {
                            SFX.rareItem();
                            onBuy(Object.assign({}, shopSpecial, { price: shopSpecial.shopPrice }));
                            setShopSpecial(null);
                        } }, disabled: gold < shopSpecial.shopPrice, style: Object.assign({}, S.btn, { borderColor: RARITY_COLOR[shopSpecial.rarity], color: RARITY_COLOR[shopSpecial.rarity], opacity: gold >= shopSpecial.shopPrice ? 1 : 0.35 }) }, "Kup")))),
        React.createElement("div", { style: S.sec }, "\uD83D\uDED2 Equipment"),
        React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 9, flexWrap: "wrap" } },
            ctInfo && React.createElement("button", { onClick: function () { setFilter("myclass"); }, style: { background: filter === "myclass" ? ctInfo.bg : "#150e04", border: "2px solid " + (filter === "myclass" ? ctInfo.color : ctInfo.color + "44"), color: ctInfo.color, padding: "4px 7px", fontSize: 10, fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontWeight: "bold" } }, ctInfo.label),
            slots.map(function (s) { return React.createElement("button", { key: s, onClick: function () { setFilter(s); }, style: { background: filter === s ? "#2e1e08" : "#150e04", border: "1px solid " + (filter === s ? "#c8a44a" : "#4a3210"), color: "#c8a44a", padding: "4px 7px", fontSize: 10, fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, display:"flex", alignItems:"center", gap: 4 } },
                s === "all" ? "📦 All" : React.createElement(React.Fragment, null, React.createElement(PixelIcon, { name: s, size: 16, fallback: SLOT_EMOJI[s] }), " ", s)); })),
        filtered.map(function (it) {
            var ok = gold >= it.price;
            var tierBorder = it.tier ? TIER_COLOR[it.tier] : "#2e1e08";
            return React.createElement("div", { key: it.id, style: Object.assign({}, S.row, { opacity: ok ? 1 : 0.55, borderLeft: "3px solid " + tierBorder }) },
                React.createElement("div", { style: { width: 34, height: 34, flexShrink: 0, display:"flex", alignItems:"center", justifyContent:"center", background:"#0d0801", borderRadius:6, border:"1px solid rgba(200,164,74,0.14)" } },
                    React.createElement(PixelIcon, { name: it.id, size: 26, fallback: SLOT_EMOJI[it.slot] })),
                React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 12 } },
                        it.name,
                        " ",
                        React.createElement("span", { style: { fontSize: 9, color: TIER_COLOR[it.tier] || "#9a7a30" } }, it.tier ? ("★".repeat(it.tier)) : "")),
                    React.createElement("div", { style: { color: "#7a6030", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, it.desc),
                    ItemBadges(it),
                    React.createElement("div", { style: { fontSize: 10, color: "#c8a44a", marginTop: 1 } }, Object.keys(it.stats).map(function (s) { return "+" + it.stats[s] + " " + s.toUpperCase(); }).join(" · ")),
                    StatDiff(it)),
                React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
                    React.createElement("div", { style: { fontSize: 11, color: "#f0c060", marginBottom: 3 } },
                        "\uD83D\uDCB0 ",
                        it.price),
                    React.createElement("button", { onClick: function () { if (ok) { SFX.buy(); onBuy(it); } }, disabled: !ok, style: Object.assign({}, S.btn, { opacity: ok ? 1 : 0.35 }) }, "Buy"))); }),
        React.createElement("div", { style: S.sec }, "\uD83E\uDDEA Potions"),
        React.createElement("div", { style: { display: "flex", gap: 7, flexWrap: "wrap" } }, POTIONS.map(function (p) {
            var ok = gold >= p.price;
            var iconKey = p.id === "p1" ? "potion_small" : p.id === "p2" ? "potion_medium" : "potion_large";
            return React.createElement("div", { key: p.id, style: { flex: 1, minWidth: 80, background: "#0a1e0a", border: "1px solid " + (ok ? "#2a6a2a" : "#1a3a1a"), borderRadius: 7, padding: "8px 6px", textAlign: "center", opacity: ok ? 1 : 0.55 } },
                React.createElement("div", { style: { display:"flex", justifyContent:"center", marginBottom: 4 } },
                    React.createElement(PixelIcon, { name: iconKey, size: 28, fallback: p.emoji })),
                React.createElement("div", { style: { fontSize: 11, fontWeight: "bold", color: "#44dd88", marginBottom: 1 } }, p.name),
                React.createElement("div", { style: { fontSize: 10, color: "#3a7a3a", marginBottom: 3 } },
                    "Heals ",
                    p.heal,
                    " HP"),
                React.createElement("div", { style: { fontSize: 10, color: "#f0c060", marginBottom: 4 } },
                    "\uD83D\uDCB0 ",
                    p.price,
                    "g"),
                React.createElement("button", { onClick: function () { if (ok) { SFX.buy(); onBuyPotion(p); } }, disabled: !ok, style: { padding: "4px 8px", background: ok ? "#1a3a1a" : "#0a1a0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 11, opacity: ok ? 1 : 0.35 } }, "Buy")); }))));
}
// ── JOBS TAB ──────────────────────────────────────────────────────────────────
function JobsTab(props) {
    var hero = props.hero, activeJob = props.activeJob, onStartJob = props.onStartJob, onCancelJob = props.onCancelJob;
    var onClaimDaily = props.onClaimDaily, canClaimDaily = props.canClaimDaily;
    var _tick = useState(0);
    var setTick = _tick[1];
    useEffect(function () {
        if (!activeJob)
            return;
        var id = setInterval(function () { setTick(function (n) { return n + 1; }); }, 1000);
        return function () { clearInterval(id); };
    }, [activeJob]);
    var activeJobData = activeJob ? JOBS.find(function (j) { return j.id === activeJob.jobId; }) : null;
    var elapsed = activeJob ? Math.min(Date.now() - activeJob.startedAt, activeJobData ? activeJobData.duration : 0) : 0;
    var pct = activeJobData ? (elapsed / activeJobData.duration * 100) : 0;
    var remaining = activeJobData ? Math.max(0, activeJobData.duration - elapsed) : 0;
    var fmtTime = function (ms) { var s = Math.ceil(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60); return h > 0 ? h + "h " + (m % 60) + "m" : m > 0 ? m + "m " + ((s % 60) < 10 ? "0" : "") + (s % 60) + "s" : s + "s"; };
    var estGold = function (job) { return Math.floor((job.baseGold[0] + job.baseGold[1]) / 2) + Math.floor((hero ? hero.level : 1) * job.bonusPerLevel); };
    return (React.createElement("div", null,
        React.createElement("div", { style: Object.assign({}, S.card, { border: "1px solid " + (canClaimDaily ? "#c8a44a88" : "#2e1e08"), marginBottom: 10 }) },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                React.createElement("div", { style: { fontSize: 28 } }, "\u2600\uFE0F"),
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: "#f0c060" } }, T("Dzienny Bonus", "Daily Bonus")),
                    React.createElement("div", { style: { fontSize: 10, color: "#7a6030" } }, T("Raz na 24h: +50g · +30⚡ · +1🥟", "Once per 24h: +50g · +30⚡ · +1🥟"))),
                React.createElement("button", { onClick: onClaimDaily, disabled: !canClaimDaily, style: Object.assign({}, S.bigBtn, { fontSize: 11, padding: "7px 12px", opacity: canClaimDaily ? 1 : 0.35, borderColor: canClaimDaily ? "#f0c060" : "#4a3210", color: canClaimDaily ? "#f0c060" : "#4a3210" }) }, canClaimDaily ? T("Odbierz!", "Claim!") : "✓ " + T("Odebrano", "Claimed")))),
        activeJob && activeJobData && (React.createElement("div", { style: Object.assign({}, S.card, { border: "1px solid #c8a44a66", marginBottom: 10 }) },
            React.createElement("div", { style: { fontSize: 11, color: "#7a6030", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 } },
                "\uD83D\uDCBC ",
                T("W trakcie pracy", "Working")),
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } },
                React.createElement("span", { style: { fontSize: 28 } }, activeJobData.emoji),
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 13 } }, T(activeJobData.name, activeJobData.nameEn)),
                    React.createElement("div", { style: { fontSize: 10, color: "#7a6030" } },
                        T("Pozostało:", "Remaining:"),
                        " ",
                        fmtTime(remaining)))),
            React.createElement("div", { style: { background: "#0a0604", borderRadius: 4, overflow: "hidden", height: 10, border: "1px solid #2e1e08", marginBottom: 8, position: "relative" } },
                React.createElement("div", { style: { width: pct + "%", height: "100%", background: "linear-gradient(90deg,#5a3808,#e0b040)", transition: "width 0.5s" } }),
                React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "rgba(230,200,90,0.9)", fontFamily: "Georgia,serif" } },
                    Math.floor(pct),
                    "%")),
            pct >= 100 ? (React.createElement("div", { style: { textAlign: "center", color: "#44dd88", fontSize: 12, fontWeight: "bold" } }, T("✅ Praca zakończona! Nagroda zostanie odebrana automatycznie.", "✅ Job done! Reward will be collected automatically."))) : (React.createElement("button", { onClick: onCancelJob, style: { width: "100%", padding: "6px", background: "#1e1206", border: "1px solid #5a3a2a", color: "#9a5a3a", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 11 } }, T("❌ Anuluj pracę (bez nagrody)", "❌ Cancel job (no reward)"))))),
        !activeJob && (React.createElement("div", null,
            React.createElement("div", { style: S.sec },
                "\uD83D\uDCBC ",
                T("Dostępne Prace", "Available Jobs")),
            React.createElement("div", { style: { fontSize: 10, color: "#7a6030", marginBottom: 8, padding: "5px 9px", background: "#150e04", border: "1px solid #2e1e08", borderRadius: 6 } }, T("Wyślij bohatera do pracy. Podczas pracy nie możesz walczyć ani wchodzić do lochów. Nagroda odebrana automatycznie po powrocie.", "Send your hero to work. During work, combat and dungeons are unavailable. Reward is collected automatically.")),
            JOBS.map(function (job) {
                var canWork = hero && hero.level >= job.minLevel;
                var est = estGold(job);
                return (React.createElement("div", { key: job.id, style: Object.assign({}, S.card, { opacity: canWork ? 1 : 0.5 }) },
                    React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center" } },
                        React.createElement("div", { style: { fontSize: 26, width: 32, textAlign: "center" } }, job.emoji),
                        React.createElement("div", { style: { flex: 1 } },
                            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, marginBottom: 1 } }, T(job.name, job.nameEn)),
                            React.createElement("div", { style: { display: "flex", gap: 10, fontSize: 10, color: "#9a7030", flexWrap: "wrap" } },
                                React.createElement("span", null,
                                    "\u23F1 ",
                                    fmtTime(job.duration)),
                                React.createElement("span", null,
                                    "\uD83D\uDCB0 ~",
                                    est,
                                    "g"),
                                React.createElement("span", { style: { color: "#9a8040" } },
                                    "+",
                                    job.bonusPerLevel,
                                    "g/",
                                    T("lvl", "lvl"))),
                            !canWork && React.createElement("div", { style: { fontSize: 9, color: "#8a3a3a", marginTop: 2 } },
                                "\uD83D\uDD12 ",
                                T("Wymaga Poziomu", "Requires Level"),
                                " ",
                                job.minLevel)),
                        React.createElement("button", { onClick: function () { if (canWork)
                                onStartJob(job); }, disabled: !canWork, style: Object.assign({}, S.bigBtn, { fontSize: 11, padding: "7px 10px", opacity: canWork ? 1 : 0.3 }) }, T("Wyślij", "Send")))));
            })))));
}
// ── TAVERN TAB ────────────────────────────────────────────────────────────────
function TavernTab(props) {
    var gold = props.gold, onResult = props.onResult, onDrinkBeer = props.onDrinkBeer;
    var stamina = props.stamina || 0, pierogi = props.pierogi || 0;
    var beerStock = props.beerStock || 0, beerLastRestock = props.beerLastRestock || 0;
    var beerBuffUntil = props.beerBuffUntil || 0;
    var hasBeerBuff = Date.now() < beerBuffUntil;
    var beerBuffMins = Math.max(0, Math.ceil((beerBuffUntil - Date.now()) / 60000));
    var _amb = useState(false);
    var ambOn = _amb[0];
    var setAmbOn = _amb[1];
    useEffect(function () {
        AM.resume();
        TAVERN_AMB.start();
        setAmbOn(true);
        return function () { if (TAVERN_AMB.active())
            TAVERN_AMB.stop(); };
    }, []);
    var _cup = useState({ bet: 20, phase: "idle", chosen: null, win: null });
    var cup = _cup[0];
    var setCup = _cup[1];
    var _dce = useState({ bet: 20, phase: "idle", pick: "high", r1: null, r2: null });
    var dce = _dce[0];
    var setDce = _dce[1];
    var _crd = useState({ bet: 20, phase: "idle", h: null, d: null });
    var crd = _crd[0];
    var setCrd = _crd[1];
    var toggleAmb = function () { AM.resume(); if (ambOn) {
        TAVERN_AMB.stop();
    }
    else {
        TAVERN_AMB.start();
    } setAmbOn(!ambOn); };
    var bS = { background: "#1e1206", border: "1px solid #4a3210", color: "#c8a44a", padding: "5px 9px", fontSize: 11, fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4 };
    var betBtn = Object.assign({}, bS, { padding: "3px 8px" });
    function adjBet(setter, d) { setter(function (p) { return Object.assign({}, p, { bet: Math.min(Math.min(gold, 500), Math.max(10, p.bet + d)) }); }); }
    var playCups = function (i) { if (cup.phase !== "idle" || gold < cup.bet)
        return; SFX.coin(); var w = rng(0, 2); var buffed = hasBeerBuff && Math.random() < 0.05; if (buffed)
        w = i; var profit = i === w ? Math.floor(cup.bet * 1.5) : -cup.bet; setCup(function (p) { return Object.assign({}, p, { phase: "done", chosen: i, win: w }); }); setTimeout(function () { onResult(profit); if (profit > 0)
        SFX.win(); }, 250); };
    var playDice = function () { if (dce.phase !== "idle" || gold < dce.bet)
        return; SFX.dice(); var r1 = rng(1, 6), r2 = rng(hasBeerBuff ? 2 : 1, 6), t = r1 + r2; var win = (dce.pick === "high" && t > 7) || (dce.pick === "low" && t < 7) || (dce.pick === "seven" && t === 7); var profit = win ? (dce.pick === "seven" ? dce.bet * 4 : Math.floor(dce.bet * 0.8)) : -dce.bet; setDce(function (p) { return Object.assign({}, p, { phase: "done", r1: r1, r2: r2 }); }); setTimeout(function () { onResult(profit); if (profit > 0)
        SFX.win(); }, 250); };
    var CARDS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    var playCard = function () { if (crd.phase !== "idle" || gold < crd.bet)
        return; SFX.cardFlip(); var hi = rng(hasBeerBuff ? 4 : 0, 12), di = rng(0, 12); var profit = hi > di ? Math.floor(crd.bet * 0.9) : hi === di ? 0 : -crd.bet; setCrd(function (p) { return Object.assign({}, p, { phase: "done", h: CARDS[hi], d: CARDS[di] }); }); setTimeout(function () { onResult(profit); if (profit > 0)
        SFX.win(); }, 250); };
    var reset = function (setter) { setter(function (p) { return Object.assign({}, p, { phase: "idle", chosen: null, win: null, r1: null, r2: null, h: null, d: null }); }); };
    var DF = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    var wC = "#44dd44", lC = "#dd4444";
    return (React.createElement("div", null,
        React.createElement("div", { style: { background: "linear-gradient(180deg,#0e0604,#180c06)", borderRadius: 8, padding: "10px 12px", marginBottom: 10, border: "1px solid #3a1808", textAlign: "center" } },
            React.createElement("div", { style: { fontSize: 11, color: "#4a2808", letterSpacing: 3 } }, "\uD83D\uDD6F\uFE0F \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 \uD83D\uDD6F\uFE0F"),
            React.createElement("div", { style: { fontSize: 16, letterSpacing: 2, color: "#8a5018", margin: "3px 0" } }, "\uD83C\uDFFA \uD83C\uDF7A \uD83C\uDFB2 \uD83C\uDCCF \uD83C\uDFB0 \uD83C\uDF7A \uD83C\uDFFA"),
            React.createElement("div", { style: { fontSize: 14, fontWeight: "bold", color: "#c8a44a", letterSpacing: 2 } }, "THE TIPSY CANNON"),
            React.createElement("div", { style: { fontSize: 9, color: "#4a2808", letterSpacing: 1, marginBottom: 7 } }, "Est. 1642 \u00B7 Finest gambling in the realm \u00B7 Enter at own risk"),
            React.createElement("button", { onClick: toggleAmb, style: Object.assign({}, bS, { fontSize: 10, borderColor: ambOn ? "#c8a44a" : "#4a3210", color: ambOn ? "#f0c060" : "#7a6030" }) }, ambOn ? "🔇 " + T("Ucisz tłum", "Silence the crowd") : "🔊 " + T("Hałas tłumu", "Crowd Noise"))),
        React.createElement("div", { style: Object.assign({}, S.card, { border: "1px solid #5a3a1a" }) },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 } },
                React.createElement("div", { style: { fontSize: 24 } }, "\uD83C\uDF7A"),
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: "#c8a44a" } },
                        T("Kufel Piwa", "Mug of Beer"),
                        " ",
                        React.createElement("span", { style: { fontSize: 10, color: "#7a6030" } }, "\u00B7 1\uD83E\uDD5F za kufel")),
                    React.createElement("div", { style: { fontSize: 10, color: "#7a6030" } },
                        "+25\u26A1 ",
                        T("staminy", "stamina"),
                        " \u00B7 +5% ",
                        T("szczęścia w grach (10 min)", "luck in games (10 min)"))),
                React.createElement("div", { style: { textAlign: "center" } },
                    React.createElement("div", { style: { fontSize: 10, color: beerStock > 0 ? "#c8a44a" : "#5a3a1a", marginBottom: 3 } },
                        beerStock,
                        "/",
                        BEER_MAX,
                        " ",
                        T("kufli", "mugs")),
                    React.createElement("button", { onClick: onDrinkBeer, disabled: beerStock <= 0 || pierogi <= 0 || stamina >= 100, style: Object.assign({}, S.bigBtn, { fontSize: 11, padding: "6px 10px", opacity: (beerStock > 0 && pierogi > 0 && stamina < 100) ? 1 : 0.35, borderColor: "#c8a44a" }) }, "\uD83E\uDD5F\u2192\uD83C\uDF7A"))),
            hasBeerBuff && React.createElement("div", { style: { fontSize: 10, color: "#f0c060", background: "#2a1a06", borderRadius: 4, padding: "4px 8px", textAlign: "center" } },
                "\uD83C\uDF7A ",
                T("Podpity! Szczęście +5%", "Tipsy! Luck +5%"),
                " \u00B7 ",
                beerBuffMins,
                " min"),
            beerStock <= 0 && React.createElement("div", { style: { fontSize: 9, color: "#6a5020", textAlign: "center" } }, T("Brak kufli — restock co 45 min", "No mugs — restocks every 45 min")),
            pierogi <= 0 && beerStock > 0 && React.createElement("div", { style: { fontSize: 9, color: "#6a5020", textAlign: "center" } }, T("Brak pierogów 🥟 — zdobywaj je z questów!", "No pierogi 🥟 — earn them from quests!"))),
        React.createElement("div", { style: S.card },
            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, marginBottom: 1 } },
                "\uD83C\uDF83 Three Cups ",
                React.createElement("span", { style: { fontSize: 10, color: "#7a6030", fontWeight: "normal" } }, "\u00B7 Find the coin \u00B7 Win 2.5\u00D7")),
            React.createElement("div", { style: { display: "flex", gap: 7, alignItems: "center", marginBottom: 7 } },
                React.createElement("button", { onClick: function () { adjBet(setCup, -10); }, style: betBtn }, "\u2212"),
                React.createElement("span", { style: { fontSize: 14, color: "#f0c060", minWidth: 40, textAlign: "center" } },
                    cup.bet,
                    "g"),
                React.createElement("button", { onClick: function () { adjBet(setCup, 10); }, style: betBtn }, "+")),
            cup.phase === "idle" ? (React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center" } }, [0, 1, 2].map(function (i) { return React.createElement("button", { key: i, onClick: function () { playCups(i); }, disabled: gold < cup.bet, style: { fontSize: 28, background: "none", border: "2px solid #3a2a10", borderRadius: 8, padding: "7px 11px", cursor: "pointer", transition: "border-color 0.2s" }, onMouseOver: function (e) { e.currentTarget.style.borderColor = "#c8a44a"; }, onMouseOut: function (e) { e.currentTarget.style.borderColor = "#3a2a10"; } }, "\uD83E\uDD64"); }))) : (React.createElement("div", { style: { textAlign: "center" } },
                React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center", marginBottom: 7 } }, [0, 1, 2].map(function (i) { return React.createElement("div", { key: i, style: { fontSize: 28, border: "2px solid " + (i === cup.win ? "#44dd44" : i === cup.chosen ? "#dd4444" : "#3a2a10"), borderRadius: 8, padding: "7px 11px", background: i === cup.win ? "#0a200a" : i === cup.chosen && i !== cup.win ? "#200a0a" : "transparent" } }, i === cup.win ? "🪙" : "🥤"); })),
                React.createElement("div", { style: { fontWeight: "bold", color: cup.chosen === cup.win ? wC : lC, marginBottom: 5 } }, cup.chosen === cup.win ? "🏆 Found it! +" + Math.floor(cup.bet * 1.5) + "g" : "💀 Wrong cup! −" + cup.bet + "g"),
                React.createElement("button", { onClick: function () { reset(setCup); }, style: bS }, "Play Again")))),
        React.createElement("div", { style: S.card },
            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, marginBottom: 1 } },
                "\uD83C\uDFB2 Dice Roll ",
                React.createElement("span", { style: { fontSize: 10, color: "#7a6030", fontWeight: "normal" } }, "\u00B7 HIGH/LOW 1.8\u00D7 \u00B7 SEVEN 5\u00D7")),
            React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 7, flexWrap: "wrap" } },
                React.createElement("button", { onClick: function () { adjBet(setDce, -10); }, style: betBtn }, "\u2212"),
                React.createElement("span", { style: { fontSize: 14, color: "#f0c060", minWidth: 40, textAlign: "center" } },
                    dce.bet,
                    "g"),
                React.createElement("button", { onClick: function () { adjBet(setDce, 10); }, style: betBtn }, "+"),
                ["high", "low", "seven"].map(function (pk) { return React.createElement("button", { key: pk, onClick: function () { setDce(function (p) { return Object.assign({}, p, { pick: pk }); }); }, style: Object.assign({}, bS, { borderColor: dce.pick === pk ? "#c8a44a" : "#4a3210", color: dce.pick === pk ? "#f0c060" : "#c8a44a", padding: "4px 7px" }) }, pk === "high" ? "HIGH 8+" : pk === "low" ? "LOW 6−" : "SEVEN"); })),
            dce.phase === "idle" ? (React.createElement("button", { onClick: playDice, disabled: gold < dce.bet, style: Object.assign({}, S.bigBtn, { width: "100%", textAlign: "center", fontSize: 13, padding: "9px", opacity: gold >= dce.bet ? 1 : 0.4 }) }, "\uD83C\uDFB2 Roll!")) : (React.createElement("div", { style: { textAlign: "center" } },
                React.createElement("div", { style: { fontSize: 30, margin: "4px 0" } },
                    DF[dce.r1],
                    " ",
                    DF[dce.r2]),
                React.createElement("div", { style: { fontSize: 11, color: "#9a7030", marginBottom: 3 } },
                    "Total: ",
                    dce.r1 + dce.r2),
                (function () { var t = dce.r1 + dce.r2, win = (dce.pick === "high" && t > 7) || (dce.pick === "low" && t < 7) || (dce.pick === "seven" && t === 7), profit = win ? (dce.pick === "seven" ? dce.bet * 4 : Math.floor(dce.bet * 0.8)) : -dce.bet; return React.createElement("div", { style: { fontWeight: "bold", color: win ? wC : lC, marginBottom: 5 } }, win ? "🏆 " + dce.pick.toUpperCase() + "! +" + Math.abs(profit) + "g" : "💀 −" + dce.bet + "g"); }()),
                React.createElement("button", { onClick: function () { reset(setDce); }, style: bS }, "Roll Again")))),
        React.createElement("div", { style: S.card },
            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, marginBottom: 1 } },
                "\uD83C\uDCCF High Card ",
                React.createElement("span", { style: { fontSize: 10, color: "#7a6030", fontWeight: "normal" } }, "\u00B7 Win 1.9\u00D7 \u00B7 Tie refunds")),
            React.createElement("div", { style: { display: "flex", gap: 7, alignItems: "center", marginBottom: 7 } },
                React.createElement("button", { onClick: function () { adjBet(setCrd, -10); }, style: betBtn }, "\u2212"),
                React.createElement("span", { style: { fontSize: 14, color: "#f0c060", minWidth: 40, textAlign: "center" } },
                    crd.bet,
                    "g"),
                React.createElement("button", { onClick: function () { adjBet(setCrd, 10); }, style: betBtn }, "+")),
            crd.phase === "idle" ? (React.createElement("button", { onClick: playCard, disabled: gold < crd.bet, style: Object.assign({}, S.bigBtn, { width: "100%", textAlign: "center", fontSize: 13, padding: "9px", opacity: gold >= crd.bet ? 1 : 0.4 }) }, "\uD83C\uDCCF Draw!")) : (React.createElement("div", { style: { textAlign: "center" } },
                React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 16, margin: "5px 0" } },
                    React.createElement("div", null,
                        React.createElement("div", { style: { fontSize: 10, color: "#7a6030", marginBottom: 2 } }, "You"),
                        React.createElement("div", { style: { fontSize: 26, background: "#1a1a2e", border: "2px solid #5a5aaa", borderRadius: 6, padding: "5px 10px", color: "#c8c8ff", minWidth: 34 } }, crd.h)),
                    React.createElement("div", { style: { display: "flex", alignItems: "center", fontSize: 12, color: "#7a6030" } }, "vs"),
                    React.createElement("div", null,
                        React.createElement("div", { style: { fontSize: 10, color: "#7a6030", marginBottom: 2 } }, "Dealer"),
                        React.createElement("div", { style: { fontSize: 26, background: "#2e1a1a", border: "2px solid #aa5a5a", borderRadius: 6, padding: "5px 10px", color: "#ffc8c8", minWidth: 34 } }, crd.d))),
                (function () { var hi = CARDS.indexOf(crd.h), di = CARDS.indexOf(crd.d), profit = hi > di ? Math.floor(crd.bet * 0.9) : hi === di ? 0 : -crd.bet; return React.createElement("div", { style: { fontWeight: "bold", color: profit > 0 ? wC : profit === 0 ? "#c8a44a" : lC, marginBottom: 5, marginTop: 3 } }, profit > 0 ? "🏆 Higher card! +" + profit + "g" : profit === 0 ? "🤝 Tie! Bet returned" : "💀 Dealer wins! −" + crd.bet + "g"); }()),
                React.createElement("button", { onClick: function () { reset(setCrd); }, style: bS }, "Deal Again"))))));
}
// ── DUNGEON TAB ───────────────────────────────────────────────────────────────
function DungeonTab(props) {
    var dungeons = props.dungeons, heroLevel = props.heroLevel, onEnter = props.onEnter;
    var cooldowns = props.cooldowns, onSkipCooldown = props.onSkipCooldown, activeJob = props.activeJob;
    var _t = useState(0);
    var setTick = _t[1];
    useEffect(function () { var any = Object.keys(cooldowns).some(function (k) { return (cooldowns[k] || 0) + COOLDOWN_MS > Date.now(); }); if (!any)
        return; var id = setInterval(function () { setTick(function (n) { return n + 1; }); }, 1000); return function () { clearInterval(id); }; }, [cooldowns]);
    return (React.createElement("div", null,
        React.createElement("div", { style: S.sec }, "\uD83C\uDFF0 Dungeons"),
        React.createElement("div", { style: { fontSize: 11, color: "#7a6030", marginBottom: 9, padding: "5px 9px", background: "#150e04", border: "1px solid #2e1e08", borderRadius: 6 } }, "Dungeons reward exclusive Rare, Epic and Legendary items. 15-min cooldown after completion."),
        activeJob && React.createElement("div", { style: { background: "#1a1206", border: "1px solid #f0c06044", borderRadius: 7, padding: "8px 12px", marginBottom: 10, fontSize: 11, color: "#f0c060" } },
            "\uD83D\uDCBC ",
            T("Jesteś w pracy — lochy niedostępne.", "You are working — dungeons unavailable.")),
        dungeons.map(function (d) { var cdLeft = cooldowns[d.id] ? Math.max(0, cooldowns[d.id] + COOLDOWN_MS - Date.now()) : 0; var onCD = cdLeft > 0; var canEnter = heroLevel >= d.minLevel && !onCD && !activeJob; var rarCol = RARITY_COLOR[d.lootTable]; return React.createElement("div", { key: d.id, style: Object.assign({}, S.card, { borderColor: canEnter ? rarCol : "#2e1e08", opacity: heroLevel >= d.minLevel ? 1 : 0.45 }) },
            React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "flex-start" } },
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 2 } },
                        React.createElement("div", { style: { width:30, height:30, background:"#0d0801", borderRadius:5, border:"1px solid "+rarCol+"44", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 } },
                            React.createElement(PixelIcon, { name: enemyIconKey(d.sections[d.sections.length-1].enemy.name), size: 24, fallback: d.emoji })),
                        React.createElement("span", { style: { fontWeight: "bold", fontSize: 13 } }, d.name),
                        React.createElement("span", { style: { fontSize: 9, color: rarCol, background: "#1a1209", border: "1px solid " + rarCol, padding: "1px 4px", borderRadius: 3 } }, d.lootTable.toUpperCase())),
                    React.createElement("div", { style: { color: "#7a6030", fontSize: 10, marginBottom: 4 } }, d.desc),
                    React.createElement("div", { style: { display: "flex", gap: 5, fontSize: 10, flexWrap: "wrap", marginBottom: 3 } }, d.sections.map(function (sec, i) { return React.createElement("span", { key: i, style: { color: sec.boss ? "#cc6644" : "#a08040" } },
                        sec.boss ? "⚠️ " : "▸ ",
                        sec.name); })),
                    React.createElement("div", { style: { fontSize: 10, display: "flex", gap: 8, color: "#a08040" } },
                        React.createElement("span", null,
                            "\uD83D\uDEB6 ",
                            d.travel,
                            "s"),
                        React.createElement("span", null,
                            "\u2728 ",
                            d.xp,
                            " XP"),
                        React.createElement("span", null,
                            "\uD83D\uDCB0 ",
                            d.gold[0],
                            "-",
                            d.gold[1],
                            "g")),
                    heroLevel < d.minLevel && React.createElement("div", { style: { color: "#8a3a3a", fontSize: 10, marginTop: 3 } },
                        "\uD83D\uDD12 ",
                        T("Wymaga Poziomu", "Requires Level"),
                        " ",
                        d.minLevel),
                    onCD && React.createElement("div", { style: { color: "#9a6030", fontSize: 10, marginTop: 3 } },
                        "\u23F0 ",
                        T("Gotowe za", "Ready in"),
                        " ",
                        fmtCooldown(cdLeft))),
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4, flexShrink: 0, marginTop: 2 } },
                    React.createElement("button", { onClick: function () { if (canEnter) {
                            SFX.enter();
                            onEnter(d);
                        } }, disabled: !canEnter, style: Object.assign({}, S.bigBtn, { fontSize: 11, padding: "7px 10px", opacity: canEnter ? 1 : 0.3, borderColor: rarCol, color: rarCol }) }, T("Wejdź", "Enter")),
                    onCD && React.createElement("button", { onClick: function () { onSkipCooldown(d.id); }, style: { padding: "4px 8px", background: "#1e1206", border: "1px solid #5a4020", color: "#8a6020", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10 } }, "Skip [\u03B1]")))); })));
}
