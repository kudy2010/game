import React, { useState, useEffect } from 'react';
import { CLASSES, STAMINA_MAX, T } from '../data.js';
import { S, ANIM_CSS } from '../styles.js';
import { CharSprite } from './icons.jsx';
import { classIconKey } from './icons.jsx';

export function CharacterSelectScreen(props) {
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
        React.createElement("div", { style: { fontSize: 52, marginBottom: 6 } }, "⚔️💣"),
        React.createElement("h1", { style: { fontSize: 28, margin: "0 0 4px", textShadow: "0 0 24px rgba(200,164,74,0.35)", letterSpacing: 3 } }, "POWDER & STEEL"),
        React.createElement("p", { style: { color: "#7a6030", fontSize: 11, maxWidth: 280, margin: "0 0 20px", lineHeight: 1.6 } }, T("Wybierz lub stwórz bohatera", "Choose or create a hero")),
        React.createElement("div", { style: { width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 10 } }, [0, 1, 2].map(function (slot) {
            var s = saves[slot];
            var hasHero = s && s.hero;
            return (React.createElement("div", { key: slot, style: { background: "#150e04", border: "2px solid " + (hasHero ? "#3e2808" : "#2a1a04"), borderRadius: 10, padding: "12px 14px" } }, confirmDel === slot ? (React.createElement("div", { style: { textAlign: "center" } },
                React.createElement("div", { style: { fontSize: 12, color: "#dd4444", marginBottom: 8 } },
                    "⚠️ ", T("Usunąć", "Delete"), " ",
                    React.createElement("strong", null, s.hero.name),
                    "? ", T("Nie można cofnąć!", "Cannot be undone!")),
                React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "center" } },
                    React.createElement("button", { onClick: function () { onDelete(slot); setSaves(function (prev) { var n = prev.slice(); n[slot] = null; return n; }); setConfirmDel(null); }, style: { padding: "6px 16px", background: "#3a0a0a", border: "1px solid #dd4444", color: "#dd4444", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 12 } },
                        "🗑️ ", T("Usuń", "Delete")),
                    React.createElement("button", { onClick: function () { setConfirmDel(null); }, style: { padding: "6px 16px", background: "#1e1206", border: "1px solid #4a3210", color: "#c8a44a", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 12 } }, T("Anuluj", "Cancel"))))) : hasHero ? (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                React.createElement("div", { style: { width:40, height:40, flexShrink:0, background:"#0d0801", borderRadius:8, border:"1px solid #3e2808", display:"flex", alignItems:"center", justifyContent:"center" } },
                    React.createElement(CharSprite, { iconKey: classIconKey(s.hero.class), emoji: CLASSES[s.hero.class].emoji, size: 34 })),
                React.createElement("div", { style: { flex: 1, textAlign: "left" } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 14 } }, s.hero.name),
                    React.createElement("div", { style: { fontSize: 10, color: "#7a6030" } },
                        CLASSES[s.hero.class].name, " · Lv.", s.hero.level, " · 💰", s.gold, "g"),
                    React.createElement("div", { style: { fontSize: 10, color: "#5a7090" } },
                        "⚡", typeof s.stamina === "number" ? s.stamina : 100, "/", STAMINA_MAX, " · 🥟", s.pierogi || 0)),
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 5 } },
                    React.createElement("button", { onClick: function () { onLoad(slot); }, style: Object.assign({}, S.bigBtn, { fontSize: 12, padding: "7px 14px" }) },
                        "▶ ", T("Graj", "Play")),
                    React.createElement("button", { onClick: function () { setConfirmDel(slot); }, style: { padding: "4px 8px", background: "#1e0a0a", border: "1px solid #5a1a1a", color: "#8a3a3a", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10 } }, "🗑️")))) : (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                React.createElement("div", { style: { fontSize: 28, color: "#2e1e08" } }, "#", slot + 1),
                React.createElement("div", { style: { flex: 1, textAlign: "left", color: "#4a3010", fontSize: 12 } },
                    "— ", T("Wolny slot", "Empty slot"), " —"),
                React.createElement("button", { onClick: function () { onNew(slot); }, style: Object.assign({}, S.bigBtn, { fontSize: 12, padding: "7px 14px", borderColor: "#3e2808", color: "#7a6030" }) },
                    "+ ", T("Nowa postać", "New hero"))))));
        }))));
}
