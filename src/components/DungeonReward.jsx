import React from 'react';
import { RARITY_COLOR, RARITY_GLOW, SLOT_EMOJI } from '../data.js';
import { S, ANIM_CSS } from '../styles.js';
import { PixelIcon } from './icons.jsx';

export function DungeonReward(props) {
    var dr = props.dr, onClaim = props.onClaim;
    var rarity = dr.loot.rarity;
    var rarAnim = rarity === "legendary" ? "legendaryPulse 2s ease-in-out infinite" : rarity === "epic" ? "epicPulse 2s ease-in-out infinite" : "rarePulse 2s ease-in-out infinite";
    return (React.createElement("div", { style: Object.assign({}, S.overlay, { justifyContent: "center", alignItems: "center", padding: 20, textAlign: "center" }) },
        React.createElement("style", null, ANIM_CSS),
        React.createElement("div", { style: { fontSize: 34, marginBottom: 5 } }, "🏆"),
        React.createElement("div", { style: { fontSize: 19, fontWeight: "bold", marginBottom: 2 } }, "Dungeon Cleared!"),
        React.createElement("div", { style: { fontSize: 12, color: "#7a6030", marginBottom: 14 } },
            dr.dungeon.emoji, " ", dr.dungeon.name),
        React.createElement("div", { style: { background: "#150e04", border: "2px solid " + RARITY_COLOR[rarity], borderRadius: 10, padding: 14, marginBottom: 12, maxWidth: 270, width: "100%", boxSizing: "border-box", animation: rarAnim, boxShadow: RARITY_GLOW[rarity] } },
            React.createElement("div", { style: { fontSize: 10, color: RARITY_COLOR[rarity], textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 } },
                rarity, " item"),
            React.createElement("div", { style: { display:"flex", justifyContent:"center", marginBottom: 8 } },
                React.createElement("div", { style: { width:52, height:52, background:"#0d0801", borderRadius:10, border:"2px solid "+RARITY_COLOR[rarity], boxShadow: RARITY_GLOW[rarity], display:"flex", alignItems:"center", justifyContent:"center" } },
                    React.createElement(PixelIcon, { name: dr.loot.id, size: 38, fallback: SLOT_EMOJI[dr.loot.slot] }))),
            React.createElement("div", { style: { fontSize: 14, fontWeight: "bold", color: RARITY_COLOR[rarity], marginBottom: 3 } }, dr.loot.name),
            React.createElement("div", { style: { fontSize: 11, color: "#7a6030", marginBottom: 4 } }, dr.loot.desc),
            React.createElement("div", { style: { fontSize: 11, color: "#c8a44a" } }, Object.keys(dr.loot.stats).map(function (k) { return "+" + dr.loot.stats[k] + " " + k.toUpperCase(); }).join(" · "))),
        React.createElement("div", { style: { display: "flex", gap: 14, fontSize: 13, color: "#c8a44a", marginBottom: 14 } },
            React.createElement("span", null, "✨ +", dr.xpG, " XP"),
            React.createElement("span", null, "💰 +", dr.goldG, "g")),
        React.createElement("button", { onClick: onClaim, style: Object.assign({}, S.bigBtn, { width: "100%", maxWidth: 270, textAlign: "center", borderColor: "#44dd44", color: "#44dd44", fontSize: 14 }) }, "✅ Claim Rewards")));
}
