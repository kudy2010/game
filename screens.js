// ── TITLE / CREATE ────────────────────────────────────────────────────────────
// ── CHARACTER SELECT ─────────────────────────────────────────────────────────
function CharacterSelectScreen(props) {
    var onLoad = props.onLoad, onNew = props.onNew, onDelete = props.onDelete, loadSlot = props.loadSlot;
    var _saves = useState([null, null, null]);
    var saves = _saves[0];
    var setSaves = _saves[1];
    var _del = useState(null);
    var confirmDel = _del[0];
    var setConfirmDel = _del[1];
    useEffect(function () {
        Promise.all([0, 1, 2].map(function (s) { return loadSlot(s).catch(function () { return null; }); }))
            .then(function (s) { setSaves(s); })
            .catch(function () { });
    }, []);
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0d0801", color: "#c8a44a", fontFamily: "Georgia,serif", textAlign: "center", padding: "20px 16px" } },
        React.createElement("style", null, ANIM_CSS),
        React.createElement("div", { style: { fontSize: 52, marginBottom: 6 } }, "\u2694\uFE0F\uD83D\uDCA3"),
        React.createElement("h1", { style: { fontSize: 28, margin: "0 0 4px", textShadow: "0 0 24px rgba(200,164,74,0.35)", letterSpacing: 3 } }, "POWDER & STEEL"),
        React.createElement("p", { style: { color: "#7a6030", fontSize: 11, maxWidth: 280, margin: "0 0 20px", lineHeight: 1.6 } }, T("Wybierz lub stwórz bohatera", "Choose or create a hero")),
        React.createElement("div", { style: { width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 10 } }, [0, 1, 2].map(function (slot) {
            var s = saves[slot];
            var hasHero = s && s.hero;
            return (React.createElement("div", { key: slot, style: { background: "#150e04", border: "2px solid " + (hasHero ? "#3e2808" : "#2a1a04"), borderRadius: 10, padding: "12px 14px" } }, confirmDel === slot ? (React.createElement("div", { style: { textAlign: "center" } },
                React.createElement("div", { style: { fontSize: 12, color: "#dd4444", marginBottom: 8 } },
                    "\u26A0\uFE0F ",
                    T("Usunąć", "Delete"),
                    " ",
                    React.createElement("strong", null, s.hero.name),
                    "? ",
                    T("Nie można cofnąć!", "Cannot be undone!")),
                React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "center" } },
                    React.createElement("button", { onClick: function () { onDelete(slot); setSaves(function (prev) { var n = prev.slice(); n[slot] = null; return n; }); setConfirmDel(null); }, style: { padding: "6px 16px", background: "#3a0a0a", border: "1px solid #dd4444", color: "#dd4444", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 12 } },
                        "\uD83D\uDDD1\uFE0F ",
                        T("Usuń", "Delete")),
                    React.createElement("button", { onClick: function () { setConfirmDel(null); }, style: { padding: "6px 16px", background: "#1e1206", border: "1px solid #4a3210", color: "#c8a44a", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 12 } }, T("Anuluj", "Cancel"))))) : hasHero ? (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                React.createElement("div", { style: { width:40, height:40, flexShrink:0, background:"#0d0801", borderRadius:8, border:"1px solid #3e2808", display:"flex", alignItems:"center", justifyContent:"center" } },
                    React.createElement(CharSprite, { iconKey: classIconKey(s.hero.class), emoji: CLASSES[s.hero.class].emoji, size: 34 })),
                React.createElement("div", { style: { flex: 1, textAlign: "left" } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 14 } }, s.hero.name),
                    React.createElement("div", { style: { fontSize: 10, color: "#7a6030" } },
                        CLASSES[s.hero.class].name,
                        " \u00B7 Lv.",
                        s.hero.level,
                        " \u00B7 \uD83D\uDCB0",
                        s.gold,
                        "g"),
                    React.createElement("div", { style: { fontSize: 10, color: "#5a7090" } },
                        "\u26A1",
                        typeof s.stamina === "number" ? s.stamina : 100,
                        "/",
                        STAMINA_MAX,
                        " \u00B7 \uD83E\uDD5F",
                        s.pierogi || 0)),
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 5 } },
                    React.createElement("button", { onClick: function () { onLoad(slot); }, style: Object.assign({}, S.bigBtn, { fontSize: 12, padding: "7px 14px" }) },
                        "\u25B6 ",
                        T("Graj", "Play")),
                    React.createElement("button", { onClick: function () { setConfirmDel(slot); }, style: { padding: "4px 8px", background: "#1e0a0a", border: "1px solid #5a1a1a", color: "#8a3a3a", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10 } }, "\uD83D\uDDD1\uFE0F")))) : (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                React.createElement("div", { style: { fontSize: 28, color: "#2e1e08" } },
                    "#",
                    slot + 1),
                React.createElement("div", { style: { flex: 1, textAlign: "left", color: "#4a3010", fontSize: 12 } },
                    "\u2014 ",
                    T("Wolny slot", "Empty slot"),
                    " \u2014"),
                React.createElement("button", { onClick: function () { onNew(slot); }, style: Object.assign({}, S.bigBtn, { fontSize: 12, padding: "7px 14px", borderColor: "#3e2808", color: "#7a6030" }) },
                    "+ ",
                    T("Nowa postać", "New hero"))))));
        }))));
}
function CreateScreen(props) {
    var _n = useState("");
    var name = _n[0];
    var setName = _n[1];
    var _c = useState(null);
    var cls = _c[0];
    var setCls = _c[1];
    var _hov = useState(null);
    var hovCls = _hov[0];
    var setHovCls = _hov[1];
    // Stat bar component for class card
    function StatBar(sbp) {
        var val = sbp.val, max = sbp.max || 12, col = sbp.col;
        return React.createElement("div", { style: { display:"flex", alignItems:"center", gap: 5, marginBottom: 2 } },
            React.createElement(PixelIcon, { name: sbp.stat, size: 14, fallback: sbp.stat.toUpperCase() }),
            React.createElement("div", { style: { flex: 1, background: "#0a0601", borderRadius: 2, overflow:"hidden", height: 5, border: "1px solid rgba(255,255,255,0.06)" } },
                React.createElement("div", { style: { width: Math.min(100, Math.round(val / max * 100)) + "%", height:"100%", background: col, borderRadius: 2, transition: "width 0.3s" } })),
            React.createElement("span", { style: { fontSize: 10, color: col, minWidth: 14, textAlign:"right", fontWeight:"bold" } }, val));
    }
    return (React.createElement("div", { style: { width: "100%", minHeight: "100vh", background: "radial-gradient(800px 600px at 50% -10%, rgba(200,164,74,0.07), transparent 55%), #0d0801", display: "flex", justifyContent: "center", alignItems: "flex-start" } },
        React.createElement("div", { style: { color: "#c8a44a", fontFamily: "Georgia,serif", padding: 16, maxWidth: 500, width: "100%", boxSizing: "border-box" } },
            React.createElement("style", null, ANIM_CSS),
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 20 } },
                React.createElement("button", { onClick: props.onBack, style: { background: "none", border: "none", color: "#7a6030", cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 22, padding: "0 4px" } }, "\u2190"),
                React.createElement("h2", { style: { textAlign: "center", letterSpacing: 2, margin: 0, flex: 1, fontSize: 18 } },
                    T("WYKUĆ BOHATERA", "FORGE YOUR HERO"),
                    " #",
                    props.slot + 1)),
            React.createElement("div", { style: { marginBottom: 18 } },
                React.createElement("div", { style: { color: "#7a6030", fontSize: 11, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 } }, T("Imię Bohatera", "Hero Name")),
                React.createElement("input", { value: name, onChange: function (e) { setName(e.target.value); }, placeholder: T("Wpisz imię...", "Enter name..."), style: S.inp })),
            React.createElement("div", { style: { color: "#7a6030", fontSize: 11, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 } }, T("Wybierz Klasę", "Choose Class")),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 } }, Object.keys(CLASSES).map(function (k) {
                var c = CLASSES[k];
                var isSelected = cls === k;
                var isHovered = hovCls === k;
                var highlight = isSelected || isHovered;
                return React.createElement("div", { key: k,
                    onClick: function () { setCls(k); },
                    onMouseEnter: function () { setHovCls(k); },
                    onMouseLeave: function () { setHovCls(null); },
                    style: {
                        display: "flex", gap: 12, alignItems: "flex-start",
                        padding: 14,
                        background: isSelected ? "linear-gradient(180deg,#1e1508,#160e04)" : "linear-gradient(180deg,#160e04,#100902)",
                        border: "2px solid " + (isSelected ? "#c8a44a" : highlight ? "#5a3a10" : "#2e1e08"),
                        borderRadius: 12, cursor: "pointer",
                        boxShadow: isSelected ? "0 0 18px rgba(200,164,74,0.16), inset 0 1px 0 rgba(255,255,255,0.05)" : "0 4px 12px rgba(0,0,0,0.5)",
                        transition: "border-color 0.15s, box-shadow 0.15s"
                    } },
                    React.createElement("div", { style: { flexShrink: 0, width: 64, height: 64, background: "#0d0801", borderRadius: 10, border: "1px solid " + (isSelected ? "#c8a44a55" : "#2e1e0888"), display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" } },
                        React.createElement(CharSprite, { iconKey: classIconKey(k), emoji: c.emoji, size: 52 })),
                    React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                        React.createElement("div", { style: { display:"flex", alignItems:"center", gap: 8, marginBottom: 3 } },
                            React.createElement("strong", { style: { fontSize: 15, color: isSelected ? "#f0c060" : "#c8a44a" } }, c.name),
                            isSelected && React.createElement("span", { style: { fontSize: 9, color: "#f0c060", background:"#3a2a00", border:"1px solid #c8a44a55", borderRadius: 8, padding:"1px 6px", letterSpacing:0.5 } }, T("WYBRANO", "SELECTED"))),
                        React.createElement("div", { style: { color: "#7a6030", fontSize: 11, marginBottom: 8, lineHeight: 1.4 } }, c.desc),
                        Object.keys(c.stats).map(function (s) {
                            return React.createElement(StatBar, { key: s, stat: s, val: c.stats[s], max: 12, col: STAT_COLOR[s] || "#c8a44a" });
                        })));
            })),
            React.createElement("button", { onClick: function () { if (name.trim() && cls) props.onCreate(name.trim(), cls); },
                style: Object.assign({}, S.bigBtn, { width: "100%", opacity: name.trim() && cls ? 1 : 0.4 }) },
                "\u2694\uFE0F ",
                T("Na pole walki!", "Enter the Field!")))));
}
