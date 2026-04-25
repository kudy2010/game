import React, { useState, useEffect } from 'react';
import { DUNGEONS, RARITY_COLOR, COOLDOWN_MS, T } from '../../data.js';
import { fmtCooldown } from '../../utils.js';
import { S } from '../../styles.js';
import { SFX } from '../../audio.js';
import { PixelIcon, enemyIconKey } from '../icons.jsx';

export function DungeonTab(props) {
    var dungeons = props.dungeons, heroLevel = props.heroLevel, onEnter = props.onEnter;
    var cooldowns = props.cooldowns, onSkipCooldown = props.onSkipCooldown, activeJob = props.activeJob;
    var _t = useState(0);
    var setTick = _t[1];
    useEffect(function () { var any = Object.keys(cooldowns).some(function (k) { return (cooldowns[k] || 0) + COOLDOWN_MS > Date.now(); }); if (!any) return; var id = setInterval(function () { setTick(function (n) { return n + 1; }); }, 1000); return function () { clearInterval(id); }; }, [cooldowns]);
    return (React.createElement("div", null,
        React.createElement("div", { style: S.sec }, "🏰 Dungeons"),
        React.createElement("div", { style: { fontSize: 11, color: "#7a6030", marginBottom: 9, padding: "5px 9px", background: "#150e04", border: "1px solid #2e1e08", borderRadius: 6 } }, "Dungeons reward exclusive Rare, Epic and Legendary items. 15-min cooldown after completion."),
        activeJob && React.createElement("div", { style: { background: "#1a1206", border: "1px solid #f0c06044", borderRadius: 7, padding: "8px 12px", marginBottom: 10, fontSize: 11, color: "#f0c060" } },
            "💼 ", T("Jesteś w pracy — lochy niedostępne.", "You are working — dungeons unavailable.")),
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
                        sec.boss ? "⚠️ " : "▸ ", sec.name); })),
                    React.createElement("div", { style: { fontSize: 10, display: "flex", gap: 8, color: "#a08040" } },
                        React.createElement("span", null, "🚶 ", d.travel, "s"),
                        React.createElement("span", null, "✨ ", d.xp, " XP"),
                        React.createElement("span", null, "💰 ", d.gold[0], "-", d.gold[1], "g")),
                    heroLevel < d.minLevel && React.createElement("div", { style: { color: "#8a3a3a", fontSize: 10, marginTop: 3 } },
                        "🔒 ", T("Wymaga Poziomu", "Requires Level"), " ", d.minLevel),
                    onCD && React.createElement("div", { style: { color: "#9a6030", fontSize: 10, marginTop: 3 } },
                        "⏰ ", T("Gotowe za", "Ready in"), " ", fmtCooldown(cdLeft))),
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4, flexShrink: 0, marginTop: 2 } },
                    React.createElement("button", { onClick: function () { if (canEnter) { SFX.enter(); onEnter(d); } }, disabled: !canEnter, style: Object.assign({}, S.bigBtn, { fontSize: 11, padding: "7px 10px", opacity: canEnter ? 1 : 0.3, borderColor: rarCol, color: rarCol }) }, T("Wejdź", "Enter")),
                    onCD && React.createElement("button", { onClick: function () { onSkipCooldown(d.id); }, style: { padding: "4px 8px", background: "#1e1206", border: "1px solid #5a4020", color: "#8a6020", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10 } }, "Skip [α]")))); })));
}
