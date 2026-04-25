// ── MAIN APP ──────────────────────────────────────────────────────────────────
function App() {
    // Start at title to avoid "infinite loading" if storage/CDN is flaky.
    var _sc = useState("title");
    var screen = _sc[0];
    var setScreen = _sc[1];
    var _hs = useState(false);
    var hasSave = _hs[0];
    var setHasSave = _hs[1];
    var _tab = useState("quests");
    var tab = _tab[0];
    var setTab = _tab[1];
    var _hero = useState(null);
    var hero = _hero[0];
    var setHero = _hero[1];
    var _inv = useState([]);
    var inventory = _inv[0];
    var setInventory = _inv[1];
    var _eq = useState({ weapon: null, helmet: null, armor: null, boots: null, accessory: null });
    var equipped = _eq[0];
    var setEquipped = _eq[1];
    var _gold = useState(50);
    var gold = _gold[0];
    var setGold = _gold[1];
    var _pot = useState({ small: 0, medium: 0, large: 0 });
    var potions = _pot[0];
    var setPotions = _pot[1];
    var _qlog = useState([]);
    var questLog = _qlog[0];
    var setQuestLog = _qlog[1];
    var _cool = useState({});
    var cooldowns = _cool[0];
    var setCooldowns = _cool[1];
    var _stam = useState(STAMINA_MAX);
    var stamina = _stam[0];
    var setStamina = _stam[1];
    var _pier = useState(0);
    var pierogi = _pier[0];
    var setPierogi = _pier[1];
    var _job = useState(null);
    var activeJob = _job[0];
    var setActiveJob = _job[1];
    var _daily = useState(0);
    var dailyLastClaim = _daily[0];
    var setDailyLastClaim = _daily[1];
    var _lang = useState("pl");
    var lang = _lang[0];
    var setLang = _lang[1];
    var _beer = useState(BEER_MAX);
    var beerStock = _beer[0];
    var setBeerStock = _beer[1];
    var _beerR = useState(0);
    var beerLastRestock = _beerR[0];
    var setBeerLastRestock = _beerR[1];
    var _beerBuff = useState(0);
    var beerBuffUntil = _beerBuff[0];
    var setBeerBuffUntil = _beerBuff[1];
    var _spool = useState(null);
    var shopPool = _spool[0];
    var setShopPool = _spool[1];
    var _ssp = useState(null);
    var shopSpecial = _ssp[0];
    var setShopSpecial = _ssp[1];
    var _sra = useState(0);
    var shopRefreshAt = _sra[0];
    var setShopRefreshAt = _sra[1];
    var _travel = useState(null);
    var travelState = _travel[0];
    var setTravelState = _travel[1];
    var _cdata = useState(null);
    var combatData = _cdata[0];
    var setCombatData = _cdata[1];
    var _dbet = useState(null);
    var dungeonBetween = _dbet[0];
    var setDungeonBetween = _dbet[1];
    var _drew = useState(null);
    var dungeonReward = _drew[0];
    var setDungeonReward = _drew[1];
    var _lu = useState(null);
    var levelUpState = _lu[0];
    var setLevelUpState = _lu[1];
    var _notif = useState(null);
    var notif = _notif[0];
    var setNotif = _notif[1];
    var _mOn = useState(false);
    var musicOn = _mOn[0];
    var setMusicOn = _mOn[1];
    var _mSong = useState(0);
    var musicSong = _mSong[0];
    var setMusicSong = _mSong[1];
    var _mVol = useState(0.5);
    var musicVol = _mVol[0];
    var setMusicVol = _mVol[1];
    var _uiSc = useState(function () { try {
        var vw = window.innerWidth;
        return vw < 500 ? Math.round(vw / 500 * 20) / 20 : 1;
    }
    catch (e) {
        return 1;
    } });
    var uiScale = _uiSc[0];
    var setUiScale = _uiSc[1];
    var _sOpen = useState(false);
    var settingsOpen = _sOpen[0];
    var setSettingsOpen = _sOpen[1];
    var musicStarted = useRef(false);
    // Audio unlock for mobile browsers (iOS/Android): resume AudioContext on first user gesture.
    var audioUnlocked = useRef(false);
    var saveTimer = useRef(null);
    var globalSaveTimer = useRef(null);
    // Load global settings (volume, uiScale) — separate from character slots
    useEffect(function () {
        window.storage.get("ps_global").then(function (r) {
            if (!r)
                return;
            try {
                var g = JSON.parse(r.value);
                if (typeof g.musicVol === "number") {
                    setMusicVol(g.musicVol);
                    AM.setMusVol(g.musicVol);
                }
                if (typeof g.uiScale === "number")
                    setUiScale(g.uiScale);
                if (typeof g.musicSong === "number")
                    setMusicSong(g.musicSong);
            }
            catch (e) { }
        }).catch(function () { });
    }, []);
    // Save global settings when they change
    useEffect(function () {
        clearTimeout(globalSaveTimer.current);
        globalSaveTimer.current = setTimeout(function () {
            try {
                window.storage.set("ps_global", JSON.stringify({ musicVol: musicVol, uiScale: uiScale, musicSong: musicSong }));
            }
            catch (e) { }
        }, 500);
    }, [musicVol, uiScale, musicSong]);
    var _slot = useState(0);
    var activeSlot = _slot[0];
    var setActiveSlot = _slot[1];
    var notify = function (msg, type) { setNotif({ msg: msg, type: type || "ok" }); setTimeout(function () { setNotif(null); }, 3000); };
    var SAVE_KEY = function (slot) { return "ps_v5_slot" + slot; };
    var loadSlot = function (slot) {
        return window.storage.get(SAVE_KEY(slot)).then(function (r) {
            if (!r)
                return null;
            try {
                return JSON.parse(r.value);
            }
            catch (e) {
                return null;
            }
        }).catch(function () { return null; });
    };
    // Load slots list for character select
    useEffect(function () {
        Promise.all([0, 1, 2].map(function (s) { return loadSlot(s).catch(function () { return null; }); }))
            .then(function (saves) {
            var hasSaveAny = saves.some(function (s) { return s && s.hero; });
            setHasSave(hasSaveAny);
            setScreen("title");
        }).catch(function () { setScreen("title"); });
    }, []);
    // Global audio unlock: first touch/click on #root or document resumes AudioContext.
    useEffect(function () {
        function unlock() {
            if (audioUnlocked.current)
                return;
            audioUnlocked.current = true;
            try {
                AM.resume();
            }
            catch (e) { }
        }
        var optsOnce = { passive: true, once: true };
        var rootEl = null;
        try {
            rootEl = document.getElementById("root");
        }
        catch (e) { }
        if (rootEl) {
            rootEl.addEventListener("pointerdown", unlock, optsOnce);
            rootEl.addEventListener("touchstart", unlock, optsOnce);
            rootEl.addEventListener("click", unlock, optsOnce);
        }
        document.addEventListener("pointerdown", unlock, optsOnce);
        document.addEventListener("touchstart", unlock, optsOnce);
        document.addEventListener("click", unlock, optsOnce);
        return function () {
            try {
                if (rootEl) {
                    rootEl.removeEventListener("pointerdown", unlock, optsOnce);
                    rootEl.removeEventListener("touchstart", unlock, optsOnce);
                    rootEl.removeEventListener("click", unlock, optsOnce);
                }
                document.removeEventListener("pointerdown", unlock, optsOnce);
                document.removeEventListener("touchstart", unlock, optsOnce);
                document.removeEventListener("click", unlock, optsOnce);
            }
            catch (e) { }
        };
    }, []);
    useEffect(function () {
        if (!hero)
            return;
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(function () { try {
            var toSave = Object.assign({}, hero);
            delete toSave._pendingLevelUp;
            window.storage.set(SAVE_KEY(activeSlot), JSON.stringify({ hero: toSave, inventory: inventory, equipped: equipped, gold: gold, potions: potions, questLog: questLog, cooldowns: cooldowns, stamina: stamina, pierogi: pierogi, activeJob: activeJob, dailyLastClaim: dailyLastClaim, lang: lang, beerStock: beerStock, beerLastRestock: beerLastRestock }));
        }
        catch (e) { } }, 900);
    }, [hero, inventory, equipped, gold, potions, questLog, cooldowns, stamina, pierogi, activeJob, dailyLastClaim, lang, beerStock, beerLastRestock]);
    var saveNow = function (onDone) {
        if (!hero) {
            if (onDone)
                onDone();
            return;
        }
        clearTimeout(saveTimer.current);
        try {
            var toSave = Object.assign({}, hero);
            delete toSave._pendingLevelUp;
            var payload = JSON.stringify({ hero: toSave, inventory: inventory, equipped: equipped, gold: gold, potions: potions, questLog: questLog, cooldowns: cooldowns, stamina: stamina, pierogi: pierogi, activeJob: activeJob, dailyLastClaim: dailyLastClaim, lang: lang, beerStock: beerStock, beerLastRestock: beerLastRestock });
            var res = window.storage.set(SAVE_KEY(activeSlot), payload);
            var finish = function () { if (onDone)
                onDone(); };
            if (res && typeof res.then === "function") {
                res.then(finish).catch(finish);
            }
            else {
                setTimeout(finish, 50);
            }
        }
        catch (e) {
            if (onDone)
                setTimeout(onDone, 50);
        }
    };
    // Single-effect travel (fixes quest bug)
    useEffect(function () {
        if (!travelState)
            return;
        if (travelState.timeLeft <= 0) {
            var td = travelState;
            setTravelState(null);
            if (td.target === "quest") {
                setCombatData({ enemy: scaleEnemy(Object.assign({}, QUEST_ENEMIES[td.data.quest.id]), hero.level), questName: td.data.quest.name, type: "quest", quest: td.data.quest });
            }
            else {
                var sec = td.data.dungeon.sections[0];
                setCombatData({ enemy: scaleEnemy(sec.enemy, hero.level), questName: td.data.dungeon.name + " — " + sec.name, type: "dungeon", dungeon: td.data.dungeon, sectionIdx: 0 });
            }
            return;
        }
        var t = setTimeout(function () { setTravelState(function (prev) { if (!prev)
            return null; return Object.assign({}, prev, { timeLeft: prev.timeLeft - 1 }); }); }, 1000);
        return function () { clearTimeout(t); };
    }, [travelState]);
    // Show level-up overlay when no other overlay is active
    useEffect(function () {
        if (!hero || !hero._pendingLevelUp)
            return;
        if (dungeonReward || dungeonBetween || combatData || travelState || levelUpState)
            return;
        setLevelUpState(hero._pendingLevelUp);
        setHero(function (prev) { var n = Object.assign({}, prev); n._pendingLevelUp = null; return n; });
    }, [hero, dungeonReward, dungeonBetween, combatData, travelState, levelUpState]);
    // Music on first user gesture (mobile Safari needs touch/pointer)
    useEffect(function () {
        if (screen !== "game")
            return;
        function handler() { if (musicStarted.current)
            return; musicStarted.current = true; AM.setMusVol(musicVol); MUSIC.start(0); setMusicOn(true); }
        var opts = { passive: true };
        document.addEventListener("pointerdown", handler, opts);
        document.addEventListener("touchstart", handler, opts);
        document.addEventListener("click", handler, opts);
        return function () {
            document.removeEventListener("pointerdown", handler, opts);
            document.removeEventListener("touchstart", handler, opts);
            document.removeEventListener("click", handler, opts);
        };
    }, [screen]);
    // Passive healing: full regen in 5 min (tick every 10s)
    useEffect(function () {
        if (!hero)
            return;
        var id = setInterval(function () { setHero(function (prev) { if (!prev || prev.hp >= prev.maxHp)
            return prev; var heal = Math.max(1, Math.floor(prev.maxHp / 30)); return Object.assign({}, prev, { hp: Math.min(prev.maxHp, prev.hp + heal) }); }); }, 10000);
        return function () { clearInterval(id); };
    }, [!!hero]);
    // Stamina regen: +1 co 3 minuty
    useEffect(function () {
        var id = setInterval(function () { setStamina(function (s) { return Math.min(STAMINA_MAX, s + 1); }); }, STAMINA_REGEN_MS);
        return function () { clearInterval(id); };
    }, []);
    // Beer restock: +1 co 45 min (maks 3)
    useEffect(function () {
        var id = setInterval(function () {
            setBeerStock(function (b) { if (b >= BEER_MAX)
                return b; return b + 1; });
            setBeerLastRestock(Date.now());
        }, BEER_RESTOCK_MS);
        return function () { clearInterval(id); };
    }, []);
    // Sync lang to window for T()
    useEffect(function () { window.__LANG = lang; }, [lang]);
    // Job auto-collect on mount and on activeJob change
    useEffect(function () {
        if (!activeJob)
            return;
        var job = JOBS.find(function (j) { return j.id === activeJob.jobId; });
        if (!job)
            return;
        var done = activeJob.startedAt + job.duration;
        var now = Date.now();
        if (now >= done) {
            var lvl = hero ? hero.level : 1;
            var earned = rng(job.baseGold[0], job.baseGold[1]) + Math.floor(lvl * job.bonusPerLevel);
            setGold(function (g) { return g + earned; });
            setActiveJob(null);
            notify("💼 " + job.emoji + " " + job.name + ": +" + earned + "g!");
            return;
        }
        var remaining = done - now;
        var t = setTimeout(function () {
            var lvl2 = hero ? hero.level : 1;
            var earned2 = rng(job.baseGold[0], job.baseGold[1]) + Math.floor(lvl2 * job.bonusPerLevel);
            setGold(function (g) { return g + earned2; });
            setActiveJob(null);
            notify("💼 " + job.emoji + " " + job.name + ": +" + earned2 + "g!");
        }, remaining);
        return function () { clearTimeout(t); };
    }, [activeJob, !!hero]);
    var toggleMusic = function () { AM.resume(); if (musicOn) {
        MUSIC.stop();
        setMusicOn(false);
    }
    else {
        MUSIC.start(musicSong);
        setMusicOn(true);
    } };
    var musicPrev = function () { MUSIC.prev(); setMusicSong(MUSIC.si()); if (!musicOn)
        setMusicOn(true); };
    var musicNext = function () { MUSIC.next(); setMusicSong(MUSIC.si()); if (!musicOn)
        setMusicOn(true); };
    var getLoot = function (lv) { var t = lv < 4 ? 1 : lv < 8 ? 2 : 3; var pool = ITEMS.filter(function (i) { return i.tier <= t; }); return Object.assign({}, pool[rng(0, pool.length - 1)], { uid: Date.now() + Math.random() }); };
    var processXpGain = function (heroState, xpG) {
        var result = applyXpForLevelUp(heroState, xpG);
        if (result.luInfo) {
            result.hero._pendingLevelUp = result.luInfo;
            setTimeout(SFX.lvlUp, 300);
        }
        return result.hero;
    };
    var onCombatWin = function (remainHp) {
        var cd = combatData;
        if (cd.type === "quest") {
            var q = cd.quest, xpG = q.xp, goldG = rng(q.gold[0], q.gold[1]);
            var loot = Math.random() < q.lootChance ? getLoot(hero.level) : null;
            var gotPierogi = Math.random() < 0.08;
            setHero(function (prev) { var nh = processXpGain(prev, xpG); nh.hp = Math.max(1, remainHp); return nh; });
            setGold(function (g) { return g + goldG; });
            if (loot)
                setInventory(function (inv) { return inv.concat([loot]); });
            if (gotPierogi)
                setPierogi(function (p) { return p + 1; });
            setQuestLog(function (p) { return [{ quest: q.name, xp: xpG, gold: goldG, loot: loot ? loot.name : null, time: new Date().toLocaleTimeString() }].concat(p).slice(0, 10); });
            setCombatData(null);
            notify("✅ +" + xpG + " XP · +" + goldG + "g" + (loot ? " · 🎁" + loot.name : "") + (gotPierogi ? " · +1🥟" : ""));
        }
        else {
            var d = cd.dungeon, nextIdx = cd.sectionIdx + 1;
            setHero(function (prev) { return Object.assign({}, prev, { hp: Math.max(1, remainHp) }); });
            if (nextIdx >= d.sections.length) {
                var lootD = getDungeonLoot(d), xpD = d.xp, goldD = rng(d.gold[0], d.gold[1]);
                setCombatData(null);
                setDungeonReward({ dungeon: d, loot: lootD, xpG: xpD, goldG: goldD });
            }
            else {
                setCombatData(null);
                setDungeonBetween({ dungeon: d, sectionIdx: nextIdx, heroHp: Math.max(1, remainHp) });
            }
        }
    };
    var onCombatLose = function () { setHero(function (prev) { return Object.assign({}, prev, { hp: Math.max(1, Math.floor(prev.maxHp * 0.25)) }); }); setCombatData(null); notify(T("💀 Pokonany. Odwrót.", "💀 Defeated. Retreat."), "err"); };
    var onCombatFlee = function (remainHp) { setHero(function (prev) { return Object.assign({}, prev, { hp: Math.max(1, remainHp) }); }); setCombatData(null); };
    var onDungeonContinue = function () { var db = dungeonBetween, sec = db.dungeon.sections[db.sectionIdx]; setHero(function (prev) { return Object.assign({}, prev, { hp: db.heroHp }); }); setCombatData({ enemy: scaleEnemy(sec.enemy, hero.level), questName: db.dungeon.name + " — " + sec.name, type: "dungeon", dungeon: db.dungeon, sectionIdx: db.sectionIdx }); setDungeonBetween(null); };
    var onDungeonFlee = function () { setDungeonBetween(null); notify(T("🏃 Uciekłeś z lochu.", "🏃 Fled dungeon."), "err"); };
    var onDungeonBetweenHeal = function (type, amount) {
        SFX.heal();
        setHero(function (prev) { return Object.assign({}, prev, { hp: Math.min(prev.maxHp, prev.hp + amount) }); });
        setDungeonBetween(function (prev) { if (!prev)
            return prev; return Object.assign({}, prev, { heroHp: Math.min(hero.maxHp, prev.heroHp + amount) }); });
        setPotions(function (prev) { var n = Object.assign({}, prev); n[type] = Math.max(0, n[type] - 1); return n; });
        notify("🧪 +" + amount + " HP");
    };
    var onDungeonRewardClaim = function () {
        var dr = dungeonReward;
        setHero(function (prev) { return processXpGain(prev, dr.xpG); });
        setGold(function (g) { return g + dr.goldG; });
        setInventory(function (inv) { return inv.concat([dr.loot]); });
        setCooldowns(function (prev) { var n = Object.assign({}, prev); n[dr.dungeon.id] = Date.now(); return n; });
        setDungeonReward(null);
        notify("✅ +" + dr.xpG + " XP · +" + dr.goldG + "g · 🎁 " + dr.loot.name);
    };
    var onLevelUpConfirm = function (choice) {
        setHero(function (prev) {
            var next = Object.assign({}, prev, { stats: Object.assign({}, prev.stats) });
            Object.keys(choice.statBonuses).forEach(function (stat) { if (choice.statBonuses[stat] > 0)
                next.stats[stat] = (next.stats[stat] || 0) + choice.statBonuses[stat]; });
            if (choice.perkId) {
                next.perks = (prev.perks || []).concat([choice.perkId]);
                var perk = PERKS.find(function (p) { return p.id === choice.perkId; });
                if (perk) {
                    if (perk.hpFlat) {
                        next.maxHp = prev.maxHp + perk.hpFlat;
                        next.hp = Math.min(next.maxHp, prev.hp + perk.hpFlat);
                    }
                    if (perk.hpPct) {
                        var inc = Math.floor(prev.maxHp * perk.hpPct);
                        next.maxHp = prev.maxHp + inc;
                        next.hp = Math.min(next.maxHp, prev.hp + inc);
                    }
                }
            }
            return next;
        });
        setLevelUpState(null);
        notify(T("💪 Awans potwierdzony!", "💪 Level up confirmed!"));
    };
    var onUsePotion = function (type) { setPotions(function (prev) { var n = Object.assign({}, prev); n[type] = Math.max(0, n[type] - 1); return n; }); };
    var onHealHero = function (type, amount) {
        if (!hero || hero.hp >= hero.maxHp)
            return;
        SFX.heal();
        setHero(function (prev) { return Object.assign({}, prev, { hp: Math.min(prev.maxHp, prev.hp + amount) }); });
        setPotions(function (prev) { var n = Object.assign({}, prev); n[type] = Math.max(0, n[type] - 1); return n; });
        notify("🧪 +" + amount + " HP");
    };
    var onInstantHeal = function () { setHero(function (prev) { return Object.assign({}, prev, { hp: prev.maxHp }); }); notify("⚡ Full HP restored! [ALPHA]"); };
    var equipItem = function (item) {
        SFX.equip();
        var prev = equipped[item.slot];
        setEquipped(function (e) { var n = Object.assign({}, e); n[item.slot] = item; return n; });
        setInventory(function (inv) { var n = inv.filter(function (i) { return i.uid !== item.uid; }); if (prev)
            n = n.concat([prev]); return n; });
        notify(T("Założono ", "Equipped ") + item.name);
    };
    var unequipItem = function (slot) { var it = equipped[slot]; if (!it)
        return; setEquipped(function (e) { var n = Object.assign({}, e); n[slot] = null; return n; }); setInventory(function (inv) { return inv.concat([it]); }); };
    var buyItem = function (it) { if (gold < it.price) {
        notify(T("Za mało złota!", "Not enough gold!"), "err");
        return;
    } setGold(function (g) { return g - it.price; }); setInventory(function (inv) { return inv.concat([Object.assign({}, it, { uid: Date.now() + Math.random() })]); }); notify(T("Kupiono ", "Bought ") + it.name + "!"); };
    var buyPotion = function (p) { if (gold < p.price) {
        notify(T("Za mało złota!", "Not enough gold!"), "err");
        return;
    } setGold(function (g) { return g - p.price; }); var key = p.id === "p1" ? "small" : p.id === "p2" ? "medium" : "large"; setPotions(function (prev) { var n = Object.assign({}, prev); n[key] = (n[key] || 0) + 1; return n; }); notify(T("Kupiono ", "Bought ") + p.name + "!"); };
    var sellItem = function (it) { var price = getSellPrice(it); setInventory(function (inv) { return inv.filter(function (i) { return i.uid !== it.uid; }); }); setGold(function (g) { return g + price; }); notify(T("Sprzedano ", "Sold ") + it.name + T(" za ", " for ") + price + "g"); };
    var skipCooldown = function (id) { setCooldowns(function (prev) { var n = Object.assign({}, prev); delete n[id]; return n; }); };
    var startTravel = function (target, data) {
        SFX.step();
        var td = Object.assign({}, data);
        if (target === "quest") {
            td.enemy = scaleEnemy(getQuestEnemy(data.quest.id), hero.level);
            var cost = getStaminaCost(data.quest);
            setStamina(function (s) { return Math.max(0, s - cost); });
        }
        setTravelState({ target: target, data: td, timeLeft: target === "dungeon" ? data.dungeon.travel : data.quest.travel, totalTime: target === "dungeon" ? data.dungeon.travel : data.quest.travel });
    };
    var skipTravel = function () {
        if (!travelState)
            return;
        var td = travelState;
        setTravelState(null);
        SFX.enter();
        if (td.target === "quest") {
            setCombatData({ enemy: td.data.enemy || scaleEnemy(getQuestEnemy(td.data.quest.id), hero.level), questName: td.data.quest.name, type: "quest", quest: td.data.quest });
        }
        else {
            var sec = td.data.dungeon.sections[0];
            setCombatData({ enemy: scaleEnemy(sec.enemy, hero.level), questName: td.data.dungeon.name + " — " + sec.name, type: "dungeon", dungeon: td.data.dungeon, sectionIdx: 0 });
        }
    };
    var applySlotData = function (s) {
        setHero(s.hero);
        setInventory(s.inventory || []);
        setEquipped(s.equipped || { weapon: null, helmet: null, armor: null, boots: null, accessory: null });
        setGold(typeof s.gold === "number" ? s.gold : 50);
        setPotions(s.potions || { small: 0, medium: 0, large: 0 });
        setQuestLog(s.questLog || []);
        setCooldowns(s.cooldowns || {});
        if (typeof s.stamina === "number")
            setStamina(s.stamina);
        else
            setStamina(STAMINA_MAX);
        if (typeof s.pierogi === "number")
            setPierogi(s.pierogi);
        else
            setPierogi(0);
        if (s.activeJob)
            setActiveJob(s.activeJob);
        else
            setActiveJob(null);
        if (s.dailyLastClaim)
            setDailyLastClaim(s.dailyLastClaim);
        else
            setDailyLastClaim(0);
        if (s.lang)
            setLang(s.lang);
        if (typeof s.beerStock === "number")
            setBeerStock(s.beerStock);
        else
            setBeerStock(BEER_MAX);
        if (s.beerLastRestock)
            setBeerLastRestock(s.beerLastRestock);
        else
            setBeerLastRestock(0);
    };
    var loadSave = function (slot) {
        loadSlot(slot).then(function (s) {
            if (!s || !s.hero)
                return;
            setActiveSlot(slot);
            applySlotData(s);
            setScreen("game");
            setTab("quests");
        });
    };
    var deleteSave = function (slot) {
        window.storage.delete(SAVE_KEY(slot)).catch(function () { });
        if (activeSlot === slot) {
            setHero(null);
            setScreen("title");
        }
        setHasSave(true);
        notify(T("🗑️ Postać usunięta.", "🗑️ Character deleted."), "err");
    };
    var createHero = function (name, cls, slot) {
        var base = CLASSES[cls].stats, maxHp = 100 + base.con * 10;
        var newHero = { name: name, class: cls, level: 1, xp: 0, xpNeeded: xpFor(1), hp: maxHp, maxHp: maxHp, stats: Object.assign({}, base), perks: [] };
        setActiveSlot(slot);
        setHero(newHero);
        setGold(50);
        setInventory([]);
        setPotions({ small: 0, medium: 0, large: 0 });
        setEquipped({ weapon: null, helmet: null, armor: null, boots: null, accessory: null });
        setQuestLog([]);
        setCooldowns({});
        setStamina(STAMINA_MAX);
        setPierogi(0);
        setActiveJob(null);
        setDailyLastClaim(0);
        setBeerStock(BEER_MAX);
        setBeerLastRestock(0);
        setScreen("game");
        setTab("quests");
    };
    var onTavernResult = function (profit) { if (profit === 0)
        return; setGold(function (g) { return Math.max(0, g + profit); }); if (profit > 0)
        notify("🏆 +" + profit + "g!");
    else
        notify("💀 −" + Math.abs(profit) + "g", "err"); };
    var changeScale = function (v) { setUiScale(Math.max(0.7, Math.min(2.0, Math.round(v * 100) / 100))); };
    var startJob = function (job) {
        if (activeJob)
            return;
        SFX.enter();
        setActiveJob({ jobId: job.id, startedAt: Date.now() });
        notify(T("💼 Wyruszono do pracy: ", "💼 Left for work: ") + job.emoji + " " + T(job.name, job.nameEn));
    };
    var cancelJob = function () {
        if (!activeJob)
            return;
        setActiveJob(null);
        notify(T("❌ Praca anulowana.", "❌ Job cancelled."), "err");
    };
    var drinkBeer = function () {
        if (beerStock <= 0 || pierogi <= 0 || stamina >= STAMINA_MAX)
            return;
        SFX.heal();
        setBeerStock(function (b) { return Math.max(0, b - 1); });
        setPierogi(function (p) { return Math.max(0, p - 1); });
        setStamina(function (s) { return Math.min(STAMINA_MAX, s + 25); });
        setBeerBuffUntil(Date.now() + 10 * 60 * 1000);
        notify(T("🍺 Kufel wypity! +25 ⚡ · Szczęście +5% (10 min)", "🍺 Beer! +25 ⚡ · Luck +5% (10 min)"));
    };
    var claimDaily = function () {
        var now = Date.now();
        if (now - dailyLastClaim < 24 * 60 * 60 * 1000)
            return;
        setGold(function (g) { return g + 50; });
        setStamina(function (s) { return Math.min(STAMINA_MAX, s + 30); });
        setPierogi(function (p) { return p + 1; });
        setDailyLastClaim(now);
        SFX.rareItem();
        notify(T("☀️ Dzienny bonus! +50g · +30⚡ · +1🥟", "☀️ Daily bonus! +50g · +30⚡ · +1🥟"));
    };
    var canClaimDaily = function () { return Date.now() - dailyLastClaim >= 24 * 60 * 60 * 1000; };
    if (screen === "loading")
        return React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0d0801", color: "#c8a44a", fontFamily: "Georgia,serif", fontSize: 18 } }, T("Ładowanie...", "Loading..."));
    if (screen === "title")
        return React.createElement(CharacterSelectScreen, { onLoad: loadSave, onNew: function (slot) { setActiveSlot(slot); setScreen("create"); }, onDelete: deleteSave, loadSlot: loadSlot });
    if (screen === "create")
        return React.createElement(CreateScreen, { onCreate: function (name, cls) { createHero(name, cls, activeSlot); }, onBack: function () { setScreen("title"); }, slot: activeSlot });
    if (!hero)
        return null;
    var stats = computeStats(hero, equipped);
    var xpPct = hero.xp / hero.xpNeeded * 100;
    var availQ = QUESTS.filter(function (q) { return q.minLevel <= hero.level; });
    window.__LANG = lang;
    var TABS = [["hero", "⚔️", T("Bohater", "Hero")], ["quests", "🗺️", T("Questy", "Quests")], ["inventory", "🎒", T("Torba", "Bag")], ["shop", "🏪", T("Sklep", "Shop")], ["dungeon", "🏰", "Dungeon"], ["jobs", "💼", T("Praca", "Jobs")], ["tavern", "🍺", "Tavern"]];
    // Tab icon map (pixel-art slot icons where we have them)
    var TAB_ICON = { hero: "str", quests: null, inventory: "accessory", shop: "potion_small", dungeon: null, jobs: null, tavern: null };
    return (React.createElement("div", { style: { width: "100%", minHeight: "100vh", background: "#0d0801", display: "flex", justifyContent: "center", alignItems: "flex-start" } },
        // UI scaling: `zoom` is not reliable on mobile Safari, so we provide a transform fallback.
        React.createElement("div", { style: (function () {
                var canZoom = false;
                try {
                    canZoom = !!(window.CSS && CSS.supports && CSS.supports("zoom", "1"));
                }
                catch (e) { }
                if (canZoom) {
                    return Object.assign({}, S.wrap, { zoom: uiScale, width: "100%" });
                }
                // Transform fallback keeps layout width consistent
                return Object.assign({}, S.wrap, { transform: "scale(" + uiScale + ")", transformOrigin: "top center", width: (100 / uiScale) + "%" });
            })() },
            React.createElement("style", null, ANIM_CSS),
            dungeonReward && React.createElement(DungeonReward, { dr: dungeonReward, onClaim: onDungeonRewardClaim }),
            !dungeonReward && dungeonBetween && React.createElement(DungeonBetween, { db: dungeonBetween, maxHp: hero.maxHp, potions: potions, perks: hero.perks || [], onContinue: onDungeonContinue, onFlee: onDungeonFlee, onHeal: onDungeonBetweenHeal }),
            !dungeonReward && !dungeonBetween && combatData && React.createElement(CombatScreen, { hero: hero, equipped: equipped, enemy: combatData.enemy, questName: combatData.questName, onWin: onCombatWin, onLose: onCombatLose, onFlee: onCombatFlee, potions: potions, onUsePotion: onUsePotion }),
            !dungeonReward && !dungeonBetween && !combatData && travelState && React.createElement(TravelScreen, { ts: travelState, onSkip: skipTravel }),
            !dungeonReward && !dungeonBetween && !combatData && !travelState && levelUpState && React.createElement(LevelUpOverlay, { luInfo: levelUpState, hero: hero, onConfirm: onLevelUpConfirm }),
            notif && React.createElement("div", { style: { position: "fixed", top: 14, left: "50%", transform: "translateX(-50%)", padding: "9px 18px", borderRadius: 6, fontSize: 13, zIndex: 9999, border: "1px solid rgba(255,255,255,0.15)", maxWidth: "90%", textAlign: "center", fontFamily: "Georgia,serif", pointerEvents: "none", background: notif.type === "err" ? "#6a1a1a" : "#1a4a2a" } }, notif.msg),
            React.createElement("div", { style: S.hdr },
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 2 } },
                    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } },
                        React.createElement(CharSprite, { iconKey: classIconKey(hero.class), emoji: CLASSES[hero.class].emoji, size: 22 }),
                        React.createElement("span", { style: { fontSize: 14, fontWeight: "bold" } }, hero.name),
                        React.createElement("span", { style: { fontSize: 10, color: "#7a6030" } },
                            CLASSES[hero.class].name,
                            " Lv.",
                            hero.level)),
                    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } },
                        React.createElement("button", { onClick: function () { saveNow(function () { notify(T("💾 Zapisano!", "💾 Saved!")); setScreen("title"); }); }, style: { padding: "3px 9px", background: "#1e1206", border: "1px solid #c8a44a", color: "#c8a44a", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10, letterSpacing: 0.5 } },
                            "\uD83D\uDCBE ",
                            T("Zapisz i wyjdź", "Save & Exit")),
                        activeJob && React.createElement("span", { style: { fontSize: 9, color: "#f0c060" } },
                            "\uD83D\uDCBC ",
                            T("W pracy...", "Working...")))),
                React.createElement("div", { style: { textAlign: "right" } },
                    React.createElement("div", { style: { display: "flex", gap: 7, justifyContent: "flex-end", alignItems: "center", marginBottom: 2 } },
                        React.createElement("span", { style: { fontSize: 11, color: "#c8a44a", fontWeight: "bold" } },
                            "\uD83D\uDCB0 ",
                            gold),
                        React.createElement("span", { style: { fontSize: 11, color: "#c8e4ff" } },
                            "\uD83E\uDD5F ",
                            pierogi)),
                    React.createElement("div", { style: { width: 80 } },
                        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 8, color: "#5a7090", marginBottom: 1 } },
                            React.createElement("span", null,
                                "\u26A1 ",
                                T("Stamina", "Stamina")),
                            React.createElement("span", { style: { color: stamina < 20 ? "#dd4444" : "#5a7090" } },
                                stamina,
                                "/",
                                STAMINA_MAX)),
                        React.createElement("div", { style: { background: "#0a0c14", borderRadius: 3, overflow: "hidden", height: 6, border: "1px solid #1e2a3a" } },
                            React.createElement("div", { style: { width: (stamina / STAMINA_MAX * 100) + "%", height: "100%", background: stamina < 20 ? "linear-gradient(90deg,#6a1010,#dd3333)" : "linear-gradient(90deg,#1a4a8a,#44aaff)", transition: "width 0.4s" } }))))),
            React.createElement("div", { style: S.mbar },
                React.createElement("button", { onClick: function () { AM.resume(); musicPrev(); }, style: S.mBtn }, "\u25C0"),
                React.createElement("button", { onClick: function () { AM.resume(); toggleMusic(); }, style: S.mBtn }, musicOn ? "⏸" : "▶"),
                React.createElement("button", { onClick: function () { AM.resume(); musicNext(); }, style: S.mBtn }, "\u25B6\u25B6"),
                React.createElement("span", { style: { flex: 1, fontSize: 10, color: "#9a7030", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginLeft: 2 } },
                    "\uD83C\uDFB5 ",
                    MUSIC.SONGS[musicSong].name),
                React.createElement("span", { style: { fontSize: 10, color: "#6a5020" } }, "\uD83D\uDD0A"),
                React.createElement("input", { type: "range", min: "0", max: "100", value: Math.round(musicVol * 100), onChange: function (e) { var v = parseFloat(e.target.value) / 100; setMusicVol(v); AM.setMusVol(v); }, style: { width: 50 } }),
                React.createElement("button", { onClick: function () { setSettingsOpen(function (o) { return !o; }); }, title: "Display settings", style: Object.assign({}, S.mBtn, { fontSize: 14, color: settingsOpen ? "#f0c060" : "#7a6030", marginLeft: 3 }) }, "\u2699\uFE0F")),
            settingsOpen && React.createElement("div", { style: { padding: "7px 12px", background: "#100c04", borderBottom: "1px solid #2e1e08" } },
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 6 } },
                    React.createElement("span", { style: { fontSize: 11, color: "#7a6030", whiteSpace: "nowrap" } },
                        "\uD83D\uDCD0 ",
                        T("Skala", "Scale")),
                    React.createElement("button", { onClick: function () { changeScale(uiScale - 0.05); }, style: Object.assign({}, S.mBtn, { fontSize: 15, lineHeight: 1 }) }, "\u2212"),
                    React.createElement("input", { type: "range", min: "70", max: "200", value: Math.round(uiScale * 100), onChange: function (e) { changeScale(parseInt(e.target.value) / 100); }, style: { flex: 1 } }),
                    React.createElement("button", { onClick: function () { changeScale(uiScale + 0.05); }, style: Object.assign({}, S.mBtn, { fontSize: 15, lineHeight: 1 }) }, "+"),
                    React.createElement("span", { style: { fontSize: 12, fontWeight: "bold", color: "#c8a44a", minWidth: 38, textAlign: "right" } },
                        Math.round(uiScale * 100),
                        "%"),
                    React.createElement("button", { onClick: function () { try {
                            var vw = window.innerWidth;
                            changeScale(vw < 500 ? Math.round(vw / 500 * 20) / 20 : 1);
                        }
                        catch (e) {
                            changeScale(1);
                        } }, style: Object.assign({}, S.mBtn, { fontSize: 10, color: "#6a9a6a", border: "1px solid #2a5a2a", borderRadius: 3, padding: "2px 5px" }) }, "Auto")),
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                    React.createElement("span", { style: { fontSize: 11, color: "#7a6030" } },
                        "\uD83C\uDF0D ",
                        T("Język", "Language")),
                    React.createElement("button", { onClick: function () { setLang(function (l) { return l === "pl" ? "en" : "pl"; }); }, style: { padding: "3px 10px", background: "#1e1206", border: "1px solid #c8a44a", color: "#c8a44a", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 11 } }, lang === "pl" ? "🇵🇱 Polski → EN" : "🇬🇧 English → PL")),
                React.createElement("div", { style: { fontSize: 9, color: "#4a3820", letterSpacing: 0.5, marginTop: 4 } }, "\uD83D\uDCF1 Auto fits screen width \u00B7 Range 70%\u2013200%")),
            React.createElement("div", { style: { height: 7, background: "#150e04", position: "relative", borderBottom: "1px solid #2e1e08", overflow: "hidden" } },
                React.createElement("div", { style: { width: xpPct + "%", height: "100%", background: "linear-gradient(90deg,#5a3808,#e0b040,#f8d060)", transition: "width 0.5s", position: "relative", overflow: "hidden" } },
                    React.createElement("div", { style: { position: "absolute", top: 0, left: 0, height: "100%", width: "35%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.26),transparent)", animation: "xpShine 3s ease-in-out infinite" } })),
                React.createElement("div", { style: { position: "absolute", right: 5, top: "-1px", fontSize: 9, color: "#7a6030", lineHeight: "7px" } },
                    hero.xp,
                    "/",
                    hero.xpNeeded,
                    " XP")),
            React.createElement("div", { style: S.tabs }, TABS.map(function (t) {
                var isActive = tab === t[0];
                var pxKey = TAB_ICON[t[0]];
                return React.createElement("button", { key: t[0], onClick: function () { setTab(t[0]); }, style: Object.assign({}, S.tab, isActive ? S.tabA : {}) },
                    pxKey
                        ? React.createElement(PixelIcon, { name: pxKey, size: 16, style: { opacity: isActive ? 1 : 0.55 } })
                        : React.createElement("span", { style: { fontSize: 15 } }, t[1]),
                    React.createElement("span", { style: { fontSize: 9, display: "block", marginTop: 1, letterSpacing: 0.3 } }, t[2])); })),
            React.createElement("div", { style: S.body },
                tab === "hero" && React.createElement(HeroTab, { hero: hero, equipped: equipped, stats: stats, potions: potions, onUnequip: unequipItem, onHeal: onHealHero, onInstantHeal: onInstantHeal }),
                tab === "quests" && React.createElement(QuestsTab, { quests: availQ, questLog: questLog, stamina: stamina, activeJob: activeJob, onStart: function (q) { startTravel("quest", { quest: q }); } }),
                tab === "inventory" && React.createElement(InventoryTab, { inventory: inventory, hero: hero, potions: potions, onEquip: equipItem, onSell: sellItem, onHeal: onHealHero }),
                tab === "shop" && React.createElement(ShopTab, { items: ITEMS, gold: gold, potions: potions, onBuy: buyItem, onBuyPotion: buyPotion, heroClass: hero.class, equipped: equipped, shopPool: shopPool, setShopPool: setShopPool, shopSpecial: shopSpecial, setShopSpecial: setShopSpecial, shopRefreshAt: shopRefreshAt, setShopRefreshAt: setShopRefreshAt }),
                tab === "dungeon" && React.createElement(DungeonTab, { dungeons: DUNGEONS, heroLevel: hero.level, cooldowns: cooldowns, activeJob: activeJob, onEnter: function (d) { startTravel("dungeon", { dungeon: d }); }, onSkipCooldown: skipCooldown }),
                tab === "jobs" && React.createElement(JobsTab, { hero: hero, activeJob: activeJob, stamina: stamina, onStartJob: startJob, onCancelJob: cancelJob, onClaimDaily: claimDaily, canClaimDaily: canClaimDaily() }),
                tab === "tavern" && React.createElement(TavernTab, { gold: gold, stamina: stamina, pierogi: pierogi, beerStock: beerStock, beerLastRestock: beerLastRestock, beerBuffUntil: beerBuffUntil, onResult: onTavernResult, onDrinkBeer: drinkBeer })))));
}

// Mount React app
(function(){
  try {
    var container = document.getElementById('root');
    var root = ReactDOM.createRoot(container);
    root.render(React.createElement(App));
  } catch(e) {
    document.getElementById('root').innerHTML =
      '<div style="padding:20px;color:#c8a44a;font-family:Georgia,serif">' +
      '<div style="font-size:20px;margin-bottom:10px">⚠️ Błąd uruchomienia</div>' +
      '<pre style="color:#dd4444;font-size:11px;white-space:pre-wrap;background:#1a0808;padding:12px;border-radius:6px">' +
      (e.stack||e.message||String(e)).replace(/</g,'&lt;') +
      '</pre></div>';
  }
})();
  </script>
