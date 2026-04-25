import React, { useState } from 'react';
import { PERKS, STAT_LABEL, STAT_COLOR, T } from '../data.js';
import { S, ANIM_CSS } from '../styles.js';
import { SFX } from '../audio.js';

export function LevelUpOverlay(props) {
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
    var adj = function (stat, d) { setAlloc(function (prev) { var n = Object.assign({}, prev); n[stat] = Math.max(0, (n[stat] || 0) + d); if (n.str + n.agi + n.int + n.con > total) return prev; return n; }); };
    var confirm = function () { if (!canDone) return; SFX.lvlUp(); onConfirm({ perkId: sel, statBonuses: alloc }); };
    return (React.createElement("div", { style: Object.assign({}, S.overlay, { zIndex: 300, justifyContent: "flex-start", alignItems: "center", padding: "20px 14px", overflowY: "auto" }) },
        React.createElement("style", null, ANIM_CSS),
        React.createElement("div", { style: { textAlign: "center", marginBottom: 14, width: "100%", maxWidth: 340, animation: "lvlFlash 0.5s ease" } },
            React.createElement("div", { style: { fontSize: 11, color: "#7a6030", textTransform: "uppercase", letterSpacing: 2 } }, "⬆️ Level Up!"),
            React.createElement("div", { style: { fontSize: 22, fontWeight: "bold", color: "#f0c060", marginTop: 2 } },
                "Level ", luInfo.level)),
        choices && choices.length > 0 && (React.createElement("div", { style: { width: "100%", maxWidth: 340, marginBottom: 14 } },
            React.createElement("div", { style: S.sec }, T("✨ Wybierz Perk", "✨ Choose a Perk")),
            React.createElement("div", { style: { display: "flex", gap: 7 } }, choices.map(function (pid) {
                var p = PERKS.find(function (x) { return x.id === pid; });
                if (!p) return null;
                var isSel = sel === pid;
                return (React.createElement("div", { key: pid, onClick: function () { setSel(pid); SFX.perk(); }, style: { flex: 1, padding: 9, background: isSel ? "#1e1508" : "#150e04", border: "2px solid " + (isSel ? "#c8a44a" : "#2e1e08"), borderRadius: 8, cursor: "pointer", textAlign: "center", transition: "all 0.15s", minWidth: 0 } },
                    React.createElement("div", { style: { fontSize: 22, marginBottom: 3 } }, p.emoji),
                    React.createElement("div", { style: { fontSize: 11, fontWeight: "bold", color: isSel ? "#f0c060" : "#c8a44a", marginBottom: 2, lineHeight: 1.2 } }, p.name),
                    React.createElement("div", { style: { fontSize: 9, color: "#7a6030", lineHeight: 1.3 } }, p.desc)));
            })))),
        React.createElement("div", { style: { width: "100%", maxWidth: 340, marginBottom: 14 } },
            React.createElement("div", { style: S.sec },
                T("📊 Punkty Atrybutów", "📊 Attribute Points"), " ",
                React.createElement("span", { style: { color: left > 0 ? "#f0c060" : "#44dd88", fontSize: 12 } }, "(", left, " " + T("zostało", "left") + ")")),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } }, ["str", "agi", "int", "con"].map(function (stat) {
                var label = STAT_LABEL[stat], base = hero.stats[stat] || 0, bonus = alloc[stat] || 0, sc = STAT_COLOR[stat];
                return (React.createElement("div", { key: stat, style: { background: "#0d0801", border: "1px solid " + sc + "33", borderRadius: 6, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 } },
                    React.createElement("div", { style: { flex: 1 } },
                        React.createElement("div", { style: { fontSize: 10, color: sc + "aa" } }, label),
                        React.createElement("div", { style: { fontSize: 18, fontWeight: "bold", color: sc } },
                            base + bonus,
                            bonus > 0 && React.createElement("span", { style: { fontSize: 11, color: "#44dd88" } }, " +", bonus))),
                    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 3 } },
                        React.createElement("button", { onClick: function () { adj(stat, 1); }, disabled: left <= 0, style: { background: "#2a1a06", border: "1px solid " + sc, color: sc, width: 22, height: 22, borderRadius: 3, cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 14, opacity: left > 0 ? 1 : 0.35 } }, "+"),
                        React.createElement("button", { onClick: function () { adj(stat, -1); }, disabled: bonus <= 0, style: { background: "#1e1206", border: "1px solid #4a3210", color: "#9a7030", width: 22, height: 22, borderRadius: 3, cursor: "pointer", fontFamily: "Georgia,serif", fontSize: 14, opacity: bonus > 0 ? 1 : 0.35 } }, "−"))));
            }))),
        React.createElement("button", { onClick: confirm, disabled: !canDone, style: Object.assign({}, S.bigBtn, { width: "100%", maxWidth: 340, textAlign: "center", fontSize: 14, opacity: canDone ? 1 : 0.4, borderColor: canDone ? "#44dd44" : "#c8a44a", color: canDone ? "#44dd44" : "#c8a44a" }) }, canDone ? T("✅ Potwierdź", "✅ Confirm") : (sel === null && choices && choices.length > 0 ? T("← Najpierw wybierz perk", "← Select a perk first") : T("Przydziel wszystkie punkty", "Allocate all points")))));
}
