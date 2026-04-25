// ── ANIMATION + STYLES ───────────────────────────────────────────────────────
var ANIM_CSS = [
    "@keyframes heroAtk{0%,100%{transform:translateX(0) scale(1)}45%{transform:translateX(62px) scale(1.13)}}",
    "@keyframes enemyAtk{0%,100%{transform:translateX(0) scale(1)}45%{transform:translateX(-62px) scale(1.13)}}",
    "@keyframes shakeX{0%,100%{transform:translateX(0)}20%{transform:translateX(-11px)}40%{transform:translateX(11px)}60%{transform:translateX(-7px)}80%{transform:translateX(7px)}}",
    "@keyframes heroDodge{0%,65%,100%{transform:translateX(0)}35%{transform:translateX(-44px)}}",
    "@keyframes enemyDodge{0%,65%,100%{transform:translateX(0)}35%{transform:translateX(44px)}}",
    "@keyframes blockH{0%,100%{transform:translateX(0);filter:brightness(1)}45%{transform:translateX(-11px);filter:brightness(3) sepia(1)}}",
    "@keyframes blockE{0%,100%{transform:translateX(0);filter:brightness(1)}45%{transform:translateX(11px);filter:brightness(3) sepia(1)}}",
    "@keyframes critRecv{0%,100%{transform:scale(1)}35%{transform:scale(1.18) translateX(-9px);filter:brightness(3.5) saturate(4) hue-rotate(290deg)}70%{transform:scale(0.94) translateX(4px)}}",
    "@keyframes deadH{0%{transform:rotate(0deg);opacity:1}100%{transform:rotate(16deg) translateY(9px);opacity:0.15}}",
    "@keyframes deadE{0%{transform:rotate(0deg);opacity:1}100%{transform:rotate(-16deg) translateY(9px);opacity:0.15}}",
    "@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}",
    "@keyframes dmgUp{0%{opacity:1;top:20%}100%{opacity:0;top:-15%}}",
    "@keyframes vsGlow{0%,100%{transform:scale(1)}50%{transform:scale(1.2);text-shadow:0 0 12px #ffcc00}}",
    "@keyframes travelPulse{0%,100%{opacity:0.6}50%{opacity:1}}",
    "@keyframes flashRed{0%,100%{box-shadow:none}50%{box-shadow:0 0 18px 4px rgba(220,50,50,0.55)}}",
    "@keyframes flashGold{0%,100%{box-shadow:none}50%{box-shadow:0 0 18px 4px rgba(220,180,30,0.55)}}",
    "@keyframes healFlash{0%,100%{box-shadow:none}50%{box-shadow:0 0 18px 6px rgba(50,220,100,0.55)}}",
    "@keyframes legendaryPulse{0%,100%{box-shadow:0 0 10px #ffaa0066}50%{box-shadow:0 0 22px #ffaa00cc}}",
    "@keyframes epicPulse{0%,100%{box-shadow:0 0 8px #cc44ff55}50%{box-shadow:0 0 18px #cc44ffaa}}",
    "@keyframes rarePulse{0%,100%{box-shadow:0 0 6px #4499ff44}50%{box-shadow:0 0 14px #4499ff88}}",
    "@keyframes lvlFlash{0%{opacity:0;transform:scale(0.8)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}",
    "@keyframes bubble{0%{opacity:0;transform:translateY(6px) scale(0.85)}12%{opacity:1;transform:translateY(0) scale(1.05)}82%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-5px) scale(0.92)}}",
    "@keyframes critScreen{0%,100%{opacity:0}25%{opacity:0.4}75%{opacity:0.2}}",
    "@keyframes goldScreen{0%,100%{opacity:0}25%{opacity:0.2}75%{opacity:0.1}}",
    "@keyframes hpWarn{0%,100%{filter:brightness(1)}50%{filter:brightness(1.7)}}",
    "@keyframes xpShine{0%{transform:translateX(-100%) skewX(-20deg)}100%{transform:translateX(500%) skewX(-20deg)}}",
    "@keyframes bossPulse{0%,100%{box-shadow:0 0 4px #ff444455,inset 0 0 3px #ff444415}50%{box-shadow:0 0 18px #ff4444aa,inset 0 0 8px #ff444440}}",
    "input[type=range]{-webkit-appearance:none;height:3px;background:#3a2a10;border-radius:2px;outline:none;cursor:pointer;vertical-align:middle}",
    "input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:#c8a44a;cursor:pointer}",
    "input[type=range]::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:#c8a44a;border:none;cursor:pointer}",
    "input[type=text],input[type=text]:focus{background:#150e04 !important;color:#c8a44a !important;caret-color:#c8a44a}",
    "input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus{-webkit-box-shadow:0 0 0 1000px #150e04 inset !important;-webkit-text-fill-color:#c8a44a !important;border:1px solid #3a2a10 !important;transition:background-color 5000s ease-in-out 0s}",
    "input::placeholder{color:#4a3820 !important;opacity:1}",
].join("\n");

// ── ICONS (pixel-art 32x32 PNG) ────────────────────────────────────────────────
const ICONS = {
    // Atrybuty
    str: "assets/icons/str.png", agi: "assets/icons/agi.png",
    int: "assets/icons/int.png", con: "assets/icons/con_icon.png",
    // Sloty (generic)
    weapon: "assets/icons/weapon.png", helmet: "assets/icons/helmet.png",
    armor: "assets/icons/armor.png",   boots: "assets/icons/boots.png",
    accessory: "assets/icons/accessory.png",
    // Mikstury
    potion_small: "assets/icons/potion_small.png",
    potion_medium: "assets/icons/potion_medium.png",
    potion_large: "assets/icons/potion_large.png",
    // Klasy
    class_musketeer: "assets/icons/class_musketeer.png",
    class_knight:    "assets/icons/class_knight.png",
    class_alchemist: "assets/icons/class_alchemist.png",
    // Przedmioty sklepowe
    w1:"assets/icons/w1.png", w2:"assets/icons/w2.png", w3:"assets/icons/w3.png",
    w4:"assets/icons/w4.png", w5:"assets/icons/w5.png", w6:"assets/icons/w6.png",
    w7:"assets/icons/w7.png", w8:"assets/icons/w8.png",
    h1:"assets/icons/h1.png", h2:"assets/icons/h2.png",
    h3:"assets/icons/h3.png", h4:"assets/icons/h4.png",
    a1:"assets/icons/a1.png", a2:"assets/icons/a2.png",
    a3:"assets/icons/a3.png", a4:"assets/icons/a4.png",
    b1:"assets/icons/b1.png", b2:"assets/icons/b2.png",
    b3:"assets/icons/b3.png", b4:"assets/icons/b4.png",
    ac1:"assets/icons/ac1.png", ac2:"assets/icons/ac2.png",
    ac3:"assets/icons/ac3.png", ac4:"assets/icons/ac4.png",
    ac5:"assets/icons/ac5.png",
    // Przedmioty lochów
    dr1:"assets/icons/dr1.png", dr2:"assets/icons/dr2.png",
    dr3:"assets/icons/dr3.png", dr4:"assets/icons/dr4.png",
    dr5:"assets/icons/dr5.png", dr6:"assets/icons/dr6.png",
    de1:"assets/icons/de1.png", de2:"assets/icons/de2.png",
    de3:"assets/icons/de3.png", de4:"assets/icons/de4.png",
    de5:"assets/icons/de5.png", de6:"assets/icons/de6.png",
    dl1:"assets/icons/dl1.png", dl2:"assets/icons/dl2.png",
    dl3:"assets/icons/dl3.png", dl4:"assets/icons/dl4.png",
    dl5:"assets/icons/dl5.png", dl6:"assets/icons/dl6.png",
    // Przeciwnicy
    enemy_drunk_brawler:"assets/icons/enemy_drunk_brawler.png",
    enemy_angry_cook:"assets/icons/enemy_angry_cook.png",
    enemy_tavern_thug:"assets/icons/enemy_tavern_thug.png",
    enemy_bandit_leader:"assets/icons/enemy_bandit_leader.png",
    enemy_road_cutthroat:"assets/icons/enemy_road_cutthroat.png",
    enemy_ambush_scout:"assets/icons/enemy_ambush_scout.png",
    enemy_goblin_warchief:"assets/icons/enemy_goblin_warchief.png",
    enemy_troll_grunt:"assets/icons/enemy_troll_grunt.png",
    enemy_hex_shaman:"assets/icons/enemy_hex_shaman.png",
    enemy_smuggler_captain:"assets/icons/enemy_smuggler_captain.png",
    enemy_powder_saboteur:"assets/icons/enemy_powder_saboteur.png",
    enemy_harbor_master:"assets/icons/enemy_harbor_master.png",
    enemy_fort_commander:"assets/icons/enemy_fort_commander.png",
    enemy_elite_hussar:"assets/icons/enemy_elite_hussar.png",
    enemy_war_mage:"assets/icons/enemy_war_mage.png",
    enemy_powder_dragon:"assets/icons/enemy_powder_dragon.png",
    enemy_ancient_drake:"assets/icons/enemy_ancient_drake.png",
    enemy_corrupted_knight:"assets/icons/enemy_corrupted_knight.png",
    enemy_gate_rat:"assets/icons/enemy_gate_rat.png",
    enemy_rusted_knight:"assets/icons/enemy_rusted_knight.png",
    enemy_iron_golem:"assets/icons/enemy_iron_golem.png",
    enemy_ironwood_guard:"assets/icons/enemy_ironwood_guard.png",
    enemy_sergeant_major:"assets/icons/enemy_sergeant_major.png",
    enemy_iron_commander:"assets/icons/enemy_iron_commander.png",
    enemy_powder_warden:"assets/icons/enemy_powder_warden.png",
    enemy_blast_captain:"assets/icons/enemy_blast_captain.png",
    enemy_grand_bomb:"assets/icons/enemy_grand_bomb.png",
    enemy_drake_sentinel:"assets/icons/enemy_drake_sentinel.png",
    enemy_dragon_knight:"assets/icons/enemy_dragon_knight.png",
};
// Helper: zamienia nazwę wroga/klasy na klucz ICONS (np. "Drunk Brawler" → "enemy_drunk_brawler")
function enemyIconKey(name) {
    return "enemy_" + name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
function classIconKey(cls) { return "class_" + cls; }
// Renderuje pixel-art ikonę; fallback do emoji/tekstu gdy plik jeszcze nie istnieje
function PixelIcon(_a) {
    var name = _a.name, _b = _a.size, size = _b === void 0 ? 28 : _b, _c = _a.style, style = _c === void 0 ? {} : _c, fallback = _a.fallback;
    var src = ICONS[name];
    if (!src) return React.createElement("span", { style: { fontSize: size * 0.85, lineHeight: 1, display:"inline-block" } }, fallback || name);
    var outline = "drop-shadow(1px 0 0 rgba(0,0,0,0.95)) drop-shadow(-1px 0 0 rgba(0,0,0,0.95)) drop-shadow(0 1px 0 rgba(0,0,0,0.95)) drop-shadow(0 -1px 0 rgba(0,0,0,0.95))";
    var glow = "drop-shadow(0 0 6px rgba(200,164,74,0.20))";
    return React.createElement("img", { src: src, alt: name, style: Object.assign({ width: size, height: size, imageRendering: "pixelated", verticalAlign: "middle", filter: outline + " " + glow }, style) });
}
// Duży sprite postaci (walka, karta bohatera) — 56px, z animacją
function CharSprite(_a) {
    var iconKey = _a.iconKey, emoji = _a.emoji, size = _a.size || 56, animState = _a.animState, style = _a.style || {};
    var src = ICONS[iconKey];
    var anim = animState ? getAnim(_a.side || "hero", animState) : "";
    var dead = animState === "dead";
    var baseStyle = Object.assign({ display:"inline-block", animation: anim, filter: dead ? "grayscale(1) brightness(0.4)" : "" }, style);
    if (src) {
        var outline = "drop-shadow(1px 0 0 rgba(0,0,0,0.99)) drop-shadow(-1px 0 0 rgba(0,0,0,0.99)) drop-shadow(0 1px 0 rgba(0,0,0,0.99)) drop-shadow(0 -1px 0 rgba(0,0,0,0.99)) drop-shadow(0 0 8px rgba(200,164,74,0.18))";
        return React.createElement("img", { src: src, alt: iconKey, style: Object.assign({ width: size, height: size, imageRendering: "pixelated" }, baseStyle, { filter: (dead?"grayscale(1) brightness(0.4) ":"") + outline }) });
    }
    return React.createElement("span", { style: Object.assign({ fontSize: size * 0.78, lineHeight: 1 }, baseStyle) }, emoji);
}
var AN = {
    hero: { attack: "heroAtk 0.44s ease", dodge: "heroDodge 0.5s ease", hit: "shakeX 0.38s ease", crit: "critRecv 0.52s ease", block: "blockH 0.42s ease", dead: "deadH 0.75s ease forwards", idle: "bob 2.2s ease-in-out infinite" },
    enemy: { attack: "enemyAtk 0.44s ease", dodge: "enemyDodge 0.5s ease", hit: "shakeX 0.38s ease", crit: "critRecv 0.52s ease", block: "blockE 0.42s ease", dead: "deadE 0.75s ease forwards", idle: "bob 2.2s ease-in-out infinite" },
};
function getAnim(side, state) { var m = AN[side]; return (m && state && m[state]) || ""; }
var LC = { miss: "#5a5a6a", dodge: "#3ab4d4", block: "#ccaa20", hit: "#e0b040", crit: "#ff4444", heal: "#44dd88", info: "#c8a44a", win: "#44dd44", lose: "#dd4444" };
var S = {
    wrap: { background: "radial-gradient(1200px 700px at 50% -20%, rgba(200,164,74,0.08), transparent 55%), #0d0801", minHeight: "100vh", color: "#c8a44a", fontFamily: "Georgia,serif", maxWidth: 500, margin: "0 auto", position: "relative", paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)", paddingBottom: "env(safe-area-inset-bottom)" },
    hdr: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "linear-gradient(180deg,#1a1107,#130c04)", borderBottom: "1px solid rgba(200,164,74,0.22)", boxShadow: "0 10px 24px rgba(0,0,0,0.65)" },
    mbar: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "linear-gradient(180deg,#130c04,#0f0903)", borderBottom: "1px solid rgba(200,164,74,0.14)" },
    xpWrap: { height: 5, background: "#150e04", position: "relative", borderBottom: "1px solid #2e1e08" },
    tabs: { display: "flex", background: "linear-gradient(180deg,#160e05,#0f0903)", borderBottom: "1px solid rgba(200,164,74,0.14)" },
    tab: { flex: 1, padding: "10px 2px", background: "none", border: "none", color: "#7a6030", cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 15, transition: "all 0.15s", borderBottom: "2px solid transparent", minHeight: 48 },
    tabA: { color: "#f0c060", background: "linear-gradient(180deg,#120b03,#0d0801)", borderBottom: "2px solid #c8a44a", textShadow: "0 0 12px rgba(200,164,74,0.18)" },
    body: { padding: "12px 12px 66px" },
    card: { background: "linear-gradient(180deg,#160f06,#120b03)", border: "1px solid rgba(200,164,74,0.16)", borderRadius: 12, padding: 12, marginBottom: 10, boxShadow: "0 10px 24px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.04)" },
    row: { display: "flex", alignItems: "center", gap: 10, background: "linear-gradient(180deg,#160f06,#110a03)", border: "1px solid rgba(200,164,74,0.14)", borderRadius: 12, padding: "11px 12px", marginBottom: 8, boxShadow: "0 8px 18px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.03)" },
    sec: { fontSize: 12, color: "#7a6030", borderBottom: "1px solid #2e1e08", paddingBottom: 4, marginBottom: 9, letterSpacing: 1, textTransform: "uppercase" },
    bigBtn: { background: "linear-gradient(180deg,#6a4210,#2a1a07)", border: "2px solid rgba(200,164,74,0.95)", color: "#f0c060", padding: "12px 18px", fontSize: 14, fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 12, letterSpacing: 1, boxShadow: "0 12px 22px rgba(0,0,0,0.55), 0 0 18px rgba(200,164,74,0.12), inset 0 1px 0 rgba(255,255,255,0.08)", transition: "filter .15s ease, transform .12s ease", minHeight: 48 },
    btn: { background: "linear-gradient(180deg,#221408,#160d04)", border: "1px solid rgba(200,164,74,0.22)", color: "#c8a44a", padding: "10px 12px", fontSize: 11, fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 10, whiteSpace: "nowrap", boxShadow: "0 8px 16px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.05)", transition: "filter .15s ease, transform .12s ease", minHeight: 48 },
    mBtn: { background: "linear-gradient(180deg,rgba(200,164,74,0.08),rgba(200,164,74,0.02))", border: "1px solid rgba(200,164,74,0.18)", color: "#9a7030", cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 13, padding: "8px 10px", borderRadius: 10, minHeight: 48 },
    overlay: { position: "fixed", inset: 0, background: "#090601", zIndex: 200, display: "flex", flexDirection: "column", fontFamily: "Georgia,serif", maxWidth: 500, margin: "0 auto", color: "#c8a44a", overflowY: "auto", paddingTop: "env(safe-area-inset-top)", paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)", paddingBottom: "env(safe-area-inset-bottom)" },
    inp: { width: "100%", padding: "9px 12px", background: "#150e04", border: "1px solid #3a2a10", color: "#c8a44a", fontFamily: "Georgia,serif", fontSize: 15, borderRadius: 5, boxSizing: "border-box", outline: "none" },
};
// ── HP BAR ────────────────────────────────────────────────────────────────────
function HpBar(props) {
    var pct = Math.max(0, Math.min(100, props.pct));
    var h = props.height || 11;
    var col = pct > 55 ? "linear-gradient(90deg,#1a7a2a,#33dd55)" : pct > 28 ? "linear-gradient(90deg,#7a7010,#ddc020)" : "linear-gradient(90deg,#7a1a1a,#dd2222)";
    return (React.createElement("div", { style: { background: "#0a0604", borderRadius: 4, overflow: "hidden", height: h, border: "1px solid #2e1e08", position: "relative" } },
        React.createElement("div", { style: { width: pct + "%", height: "100%", background: col, transition: "width 0.35s", position: "relative", overflow: "hidden", animation: pct < 28 ? "hpWarn 1.1s ease-in-out infinite" : "" } }),
        React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: "35%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" } }),
        props.showText && React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "rgba(230,200,90,0.9)", fontFamily: "Georgia,serif", pointerEvents: "none", letterSpacing: 0.3 } },
            props.cur,
            "/",
            props.max)));
}
// ── FIGHTER PANEL ─────────────────────────────────────────────────────────────
function FighterPanel(props) {
    var side = props.side, name = props.name, emoji = props.emoji, iconKey = props.iconKey, curHp = props.curHp, maxHp = props.maxHp;
    var stats = props.stats, animState = props.animState, floats = props.floats || [], flash = props.flash, reaction = props.reaction;
    var pct = Math.max(0, Math.min(100, curHp / maxHp * 100));
    var isBoss = props.isBoss;
    var isHero = side === "hero";
    // Flash animation on the whole panel
    var fa = flash === "red" ? "flashRed 0.5s ease" : flash === "gold" ? "flashGold 0.5s ease" : flash === "heal" ? "healFlash 0.6s ease" : "";
    // Portrait frame colours
    var frameCol   = isBoss ? "#cc3333" : isHero ? "#c8a44a" : "#5a3a1a";
    var frameBg    = isBoss ? "linear-gradient(180deg,#1e0606,#100404)"
                   : isHero ? "linear-gradient(180deg,#120d04,#0d0801)"
                   :          "linear-gradient(180deg,#0e0c06,#080601)";
    var innerGlow  = isBoss ? "inset 0 0 22px rgba(200,40,40,0.18)"
                   : isHero ? "inset 0 0 22px rgba(200,164,74,0.10)"
                   :          "inset 0 0 18px rgba(0,0,0,0.6)";
    var bossAnim   = isBoss ? ", bossPulse 2s ease-in-out infinite" : "";
    return (React.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 } },
        // ── Portrait window ───────────────────────────────────────────────────
        React.createElement("div", { style: {
            position: "relative",
            height: 130,
            borderRadius: 10,
            border: "2px solid " + frameCol,
            background: frameBg,
            boxShadow: innerGlow + ", 0 6px 20px rgba(0,0,0,0.7)",
            overflow: "hidden",
            animation: fa + bossAnim,
            flexShrink: 0
        } },
            // corner accents
            React.createElement("div", { style: { position:"absolute", top: 3, left: 3, width: 10, height: 10, borderTop: "2px solid " + frameCol, borderLeft: "2px solid " + frameCol, borderRadius:"3px 0 0 0", opacity:0.7 } }),
            React.createElement("div", { style: { position:"absolute", top: 3, right: 3, width: 10, height: 10, borderTop: "2px solid " + frameCol, borderRight: "2px solid " + frameCol, borderRadius:"0 3px 0 0", opacity:0.7 } }),
            React.createElement("div", { style: { position:"absolute", bottom: 3, left: 3, width: 10, height: 10, borderBottom: "2px solid " + frameCol, borderLeft: "2px solid " + frameCol, borderRadius:"0 0 0 3px", opacity:0.7 } }),
            React.createElement("div", { style: { position:"absolute", bottom: 3, right: 3, width: 10, height: 10, borderBottom: "2px solid " + frameCol, borderRight: "2px solid " + frameCol, borderRadius:"0 0 3px 0", opacity:0.7 } }),
            // floor shadow at bottom of portrait
            React.createElement("div", { style: { position:"absolute", bottom:0, left:0, right:0, height:28, background:"linear-gradient(0deg,rgba(0,0,0,0.65),transparent)", pointerEvents:"none", zIndex:1 } }),
            // damage / heal floats
            floats.filter(function (f) { return f.side === side; }).map(function (f) {
                return React.createElement("div", { key: f.id, style: { position:"absolute", left:"50%", top:"22%", color:f.color, fontWeight:"bold", fontSize: f.big ? 22 : 15, animation:"dmgUp 1.1s ease forwards", zIndex:30, whiteSpace:"nowrap", textShadow:"0 2px 10px #000, 0 0 6px " + f.color, pointerEvents:"none", transform:"translateX(-50%)" } }, f.text);
            }),
            // BOSS badge
            isBoss && React.createElement("div", { style: { position:"absolute", top:5, left:"50%", transform:"translateX(-50%)", background:"#3a0000", border:"1px solid #cc3333", borderRadius:4, fontSize:8, color:"#ff6644", padding:"1px 6px", letterSpacing:1, zIndex:10, whiteSpace:"nowrap" } }, "⚠ BOSS"),
            // reaction bubble — overlays portrait
            reaction && React.createElement("div", { style: { position:"absolute", top:5, left:"50%", transform:"translateX(-50%)", background:"rgba(20,12,2,0.92)", border:"1px solid #c8a44a88", borderRadius:8, padding:"3px 8px", fontSize:9, color:"#f0d060", maxWidth:"90%", wordBreak:"break-word", animation:"bubble 2.4s ease forwards", lineHeight:1.35, zIndex:25, whiteSpace:"nowrap", textOverflow:"ellipsis", overflow:"hidden" } }, reaction),
            // ── SPRITE ────────────────────────────────────────────────────────
            React.createElement("div", { style: { position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" } },
                React.createElement(CharSprite, { iconKey: iconKey, emoji: emoji, size: 96, animState: animState, side: side }))),
        // ── Name strip ────────────────────────────────────────────────────────
        React.createElement("div", { style: { textAlign:"center", fontSize:11, fontWeight:"bold", color: isBoss ? "#ff9966" : isHero ? "#f0d080" : "#c8a44a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", letterSpacing:0.3 } }, name),
        // ── HP bar ────────────────────────────────────────────────────────────
        React.createElement(HpBar, { pct: pct, height: 11, showText: true, cur: curHp, max: maxHp }),
        // ── Compact stat row ─────────────────────────────────────────────────
        React.createElement("div", { style: { display:"flex", gap:2 } }, ["str","agi","int","con"].map(function(st) {
            var sc = STAT_COLOR[st];
            return React.createElement("div", { key:st, style:{ flex:1, background:"#0d0801", border:"1px solid "+sc+"22", borderRadius:4, padding:"2px 1px", textAlign:"center" } },
                React.createElement(PixelIcon, { name:st, size:14 }),
                React.createElement("div", { style:{ fontSize:10, fontWeight:"bold", color:sc, lineHeight:1.1 } }, stats[st]||0));
        }))));
}
// ── TRAVEL SCREEN ─────────────────────────────────────────────────────────────
function TravelScreen(props) {
    var ts = props.ts, onSkip = props.onSkip;
    var isDungeon = ts.target === "dungeon";
    var name = isDungeon ? ts.data.dungeon.name : ts.data.quest.name;
    var enemy = isDungeon ? ts.data.dungeon.sections[0].enemy : QUEST_ENEMIES[ts.data.quest.id];
    var pct = (1 - ts.timeLeft / ts.totalTime) * 100;
    useEffect(function () { if (ts.timeLeft > 0 && ts.timeLeft < ts.totalTime)
        SFX.step(); }, [ts.timeLeft]);
    return (React.createElement("div", { style: Object.assign({}, S.overlay, { justifyContent: "center", alignItems: "center", textAlign: "center", padding: 24 }) },
        React.createElement("div", { style: { fontSize: 11, color: "#7a6030", textTransform: "uppercase", letterSpacing: 2, marginBottom: 5 } }, "Travelling to"),
        React.createElement("div", { style: { fontSize: 20, fontWeight: "bold", marginBottom: 4 } }, name),
        isDungeon && React.createElement("div", { style: { fontSize: 12, color: RARITY_COLOR[ts.data.dungeon.lootTable], marginBottom: 8 } },
            "★",
            " ",
            ts.data.dungeon.lootTable,
            " loot awaits ",
            "★"),
        React.createElement("div", { style: { display:"flex", justifyContent:"center", margin: "12px 0 6px" } },
            React.createElement("div", { style: { width:64, height:64, background:"#150e04", borderRadius:12, border:"1px solid #3e2808", display:"flex", alignItems:"center", justifyContent:"center", animation:"bob 2.2s ease-in-out infinite" } },
                React.createElement(PixelIcon, { name: enemyIconKey(enemy.name), size: 50, fallback: enemy.emoji }))),
        React.createElement("div", { style: { fontSize: 13, color: "#9a7030", marginBottom: 14 } },
            React.createElement("strong", null, enemy.name),
            " guards the way"),
        React.createElement("div", { style: { background: "#1a1208", borderRadius: 6, overflow: "hidden", height: 13, border: "1px solid #3e2808", marginBottom: 6, width: "100%", maxWidth: 240, margin: "0 auto 6px" } },
            React.createElement("div", { style: { width: pct + "%", height: "100%", background: "linear-gradient(90deg,#5a3a10,#c8a44a)", transition: "width 1s linear", animation: "travelPulse 1s ease-in-out infinite" } })),
        React.createElement("div", { style: { fontSize: 13, color: "#7a6030", marginBottom: 20 } },
            "\u23F3 ",
            ts.timeLeft,
            "s"),
        React.createElement("button", { onClick: function () { SFX.enter(); onSkip(); }, style: Object.assign({}, S.bigBtn, { border: "2px solid #6a5020", color: "#9a7030", fontSize: 12 }) },
            "\u23E9 Skip Travel ",
            React.createElement("span", { style: { fontSize: 10, color: "#5a4020" } }, "[ALPHA]"))));
}
