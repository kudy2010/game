import React, { useState } from 'react';
import { QUEST_ENEMIES, getQuestDiff, getStaminaCost, T } from '../../data.js';
import { S } from '../../styles.js';
import { PixelIcon, enemyIconKey } from '../icons.jsx';

export function QuestsTab(props) {
    var quests = props.quests, questLog = props.questLog, onStart = props.onStart;
    var stamina = props.stamina || 0, activeJob = props.activeJob;
    var _open = useState(false);
    var logOpen = _open[0];
    var setLogOpen = _open[1];
    return (React.createElement("div", null,
        React.createElement("div", { style: S.sec }, T("Dostępne Questy", "Available Quests")),
        activeJob && React.createElement("div", { style: { background: "#1a1206", border: "1px solid #f0c06044", borderRadius: 7, padding: "8px 12px", marginBottom: 10, fontSize: 11, color: "#f0c060" } },
            "📼 ", T("Jesteś w pracy — questy niedostępne.", "You are working — quests unavailable.")),
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
                            React.createElement("span", { style: { fontSize: 9, color: stamina >= cost ? "#44aaff" : "#dd4444", background: "#0a0c14", border: "1px solid #1e2a3a", borderRadius: 8, padding: "1px 5px" } }, "⚡ ", cost)),
                        React.createElement("div", { style: { color: "#7a6030", fontSize: 10, margin: "2px 0 3px" } }, q.desc),
                        React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 3 } },
                            React.createElement("div", { style: { width:28, height:28, background:"#0d0801", borderRadius:5, border:"1px solid #2e1e08", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 } },
                                React.createElement(PixelIcon, { name: enemyIconKey(en.name), size: 22, fallback: en.emoji })),
                            React.createElement("span", { style: { fontSize: 10, color: "#9a7030" } },
                                React.createElement("strong", null, en.name), " · HP ", en.hp)),
                        React.createElement("div", { style: { fontSize: 10, display: "flex", gap: 8, flexWrap: "wrap", color: "#a08040" } },
                            React.createElement("span", null, "🚶 ", q.travel, "s"),
                            React.createElement("span", null, "✨ ", q.xp, " XP"),
                            React.createElement("span", null, "💰 ", q.gold[0], "-", q.gold[1], "g"),
                            React.createElement("span", null, "🎁 ", Math.floor(q.lootChance * 100), "%"))),
                    React.createElement("div", { style: { flexShrink: 0, marginTop: 2, textAlign: "center" } },
                        React.createElement("button", { onClick: function () { if (canGo) onStart(q); }, disabled: !canGo, style: Object.assign({}, S.bigBtn, { fontSize: 11, padding: "7px 10px", borderColor: canGo ? diff.color : "#4a3a1a", color: canGo ? diff.color : "#4a3a1a", opacity: canGo ? 1 : 0.4 }) },
                            "⚔️ ", T("Idź!", "Go!")),
                        !activeJob && stamina < cost && React.createElement("div", { style: { fontSize: 8, color: "#dd4444", marginTop: 2 } },
                            "⚡ ", T("Brak staminy", "Low stamina")))));
        }),
        questLog.length > 0 && React.createElement("div", null,
            React.createElement("button", { onClick: function () { setLogOpen(function (o) { return !o; }); }, style: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "6px 0", fontFamily: "Georgia,serif", width: "100%" } },
                React.createElement("div", { style: Object.assign({}, S.sec, { marginBottom: 0, flex: 1, borderBottom: "none", paddingBottom: 0 }) },
                    "📜 ", T("Dziennik Questów", "Quest Log"), " (", questLog.length, ")"),
                React.createElement("span", { style: { fontSize: 11, color: "#7a6030" } }, logOpen ? T("▲ ukryj", "▲ hide") : T("▼ pokaż", "▼ show"))),
            React.createElement("div", { style: { borderBottom: "1px solid #2e1e08", marginBottom: 9 } }),
            logOpen && questLog.map(function (e, i) { return React.createElement("div", { key: i, style: Object.assign({}, S.row, { padding: "6px 10px", fontSize: 11 }) },
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("strong", null, e.quest), " · +", e.xp, " XP · +", e.gold, "g",
                    e.loot ? " · 🎁 " + e.loot : ""),
                React.createElement("span", { style: { color: "#4a3a1a", fontSize: 10 } }, e.time)); }))));
}
