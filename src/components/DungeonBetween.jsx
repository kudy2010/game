import React from 'react';
import { S, ANIM_CSS } from '../styles.js';
import { SFX } from '../audio.js';
import { getPotionHeal, totalPotions } from '../utils.js';
import { PixelIcon } from './icons.jsx';
import { enemyIconKey } from './icons.jsx';

export function DungeonBetween(props) {
    var db = props.db, maxHp = props.maxHp, potions = props.potions, perks = props.perks || [];
    var onContinue = props.onContinue, onFlee = props.onFlee, onHeal = props.onHeal;
    var section = db.dungeon.sections[db.sectionIdx];
    var hpPct = db.heroHp / maxHp * 100;
    var tp = totalPotions(potions);
    return (React.createElement("div", { style: Object.assign({}, S.overlay, { justifyContent: "center", alignItems: "center", padding: 20, textAlign: "center" }) },
        React.createElement("style", null, ANIM_CSS),
        React.createElement("div", { style: { fontSize: 11, color: "#7a6030", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 } },
            "Section ", db.sectionIdx, "/", db.dungeon.sections.length, " Cleared"),
        React.createElement("div", { style: { fontSize: 18, fontWeight: "bold", marginBottom: 10 } },
            db.dungeon.emoji, " ", db.dungeon.name),
        React.createElement("div", { style: { background: "#150e04", border: "1px solid #2e1e08", borderRadius: 8, padding: 14, marginBottom: 12, width: "100%", maxWidth: 290, boxSizing: "border-box" } },
            React.createElement("div", { style: { fontSize: 11, color: "#7a6030", marginBottom: 4 } }, "YOUR STATUS"),
            React.createElement("div", { style: { background: "#0d0801", borderRadius: 3, overflow: "hidden", height: 11, border: "1px solid #2e1e08", marginBottom: 3 } },
                React.createElement("div", { style: { width: hpPct + "%", height: "100%", background: hpPct > 55 ? "#2a8a3a" : hpPct > 28 ? "#9a8a1a" : "#9a2a2a", transition: "width 0.3s" } })),
            React.createElement("div", { style: { fontSize: 11, color: hpPct < 30 ? "#dd4444" : "#7a6030", marginBottom: tp > 0 ? 8 : 0 } },
                db.heroHp, "/", maxHp, " HP"),
            tp > 0 && React.createElement("div", { style: { display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" } },
                potions.small > 0 && React.createElement("button", { onClick: function () { onHeal("small", getPotionHeal(30, perks)); }, style: { padding: "5px 10px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 11 } },
                    "🧪 +", getPotionHeal(30, perks), " (", potions.small, ")"),
                potions.medium > 0 && React.createElement("button", { onClick: function () { onHeal("medium", getPotionHeal(60, perks)); }, style: { padding: "5px 10px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 11 } },
                    "⚗️ +", getPotionHeal(60, perks), " (", potions.medium, ")"),
                potions.large > 0 && React.createElement("button", { onClick: function () { onHeal("large", getPotionHeal(100, perks)); }, style: { padding: "5px 10px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 11 } },
                    "🫙 +", getPotionHeal(100, perks), " (", potions.large, ")"))),
        React.createElement("div", { style: { background: "#1a0e04", border: "1px solid " + (section.boss ? "#cc4444" : "#3e2808"), borderRadius: 8, padding: 10, marginBottom: 14, width: "100%", maxWidth: 290, boxSizing: "border-box", animation: section.boss ? "bossPulse 1.4s ease-in-out infinite" : "" } },
            React.createElement("div", { style: { fontSize: 11, color: section.boss ? "#cc4444" : "#7a6030", marginBottom: 3 } }, section.boss ? "⚠️ BOSS FIGHT" : "NEXT SECTION"),
            React.createElement("div", { style: { display:"flex", justifyContent:"center", margin:"4px 0 6px" } },
                React.createElement("div", { style: { width:40, height:40, background:"#0d0801", borderRadius:7, border:"1px solid "+(section.boss?"#cc4444":"#3e2808"), display:"flex", alignItems:"center", justifyContent:"center" } },
                    React.createElement(PixelIcon, { name: enemyIconKey(section.enemy.name), size: 32, fallback: section.enemy.emoji }))),
            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13 } }, section.name, ": ", section.enemy.name),
            React.createElement("div", { style: { fontSize: 11, color: "#9a7030" } }, "HP ", section.enemy.hp)),
        React.createElement("div", { style: { display: "flex", gap: 10, width: "100%", maxWidth: 290 } },
            React.createElement("button", { onClick: function () { SFX.enter(); onContinue(); }, style: Object.assign({}, S.bigBtn, { flex: 2, textAlign: "center", fontSize: 13, padding: "9px" }) }, "Continue →"),
            React.createElement("button", { onClick: onFlee, style: { flex: 1, padding: "9px", background: "#1e1206", border: "1px solid #5a3a2a", color: "#9a5a3a", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 5, fontSize: 12 } }, "🏃 Flee"))));
}
