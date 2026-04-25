import React from 'react';
import { RARITY_COLOR, RARITY_GLOW, TIER_COLOR, SLOT_EMOJI, T } from '../../data.js';
import { getPotionHeal, totalPotions, getSellPrice, ItemBadges } from '../../utils.js';
import { S } from '../../styles.js';
import { SFX } from '../../audio.js';
import { PixelIcon } from '../icons.jsx';

export function InventoryTab(props) {
    var inventory = props.inventory, onEquip = props.onEquip, onSell = props.onSell;
    var hero = props.hero, potions = props.potions, onHeal = props.onHeal;
    var perks = hero ? hero.perks || [] : [];
    var tp = totalPotions(potions);
    if (!inventory.length && tp === 0)
        return React.createElement("div", { style: { textAlign: "center", color: "#7a6030", padding: "50px 20px" } },
            React.createElement("div", { style: { fontSize: 42 } }, "🎒"),
            React.createElement("div", { style: { marginTop: 8 } }, T("Torba pusta. Idź kogoś pobić!", "Inventory empty. Go fight someone!")));
    return (React.createElement("div", null,
        tp > 0 && hero && hero.hp < hero.maxHp && (React.createElement("div", { style: { background: "#0a1e0a", border: "1px solid #2a6a2a", borderRadius: 8, padding: "10px 12px", marginBottom: 10 } },
            React.createElement("div", { style: { fontSize: 11, color: "#3a8a3a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 7 } }, T("🧪 Użyj Mikstury", "🧪 Use Potion")),
            React.createElement("div", { style: { display: "flex", gap: 7, flexWrap: "wrap" } },
                potions.small > 0 && React.createElement("button", { onClick: function () { onHeal("small", getPotionHeal(30, perks)); }, style: { padding: "6px 12px", background: "#0d2a0d", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 12 } },
                    "🧪 +", getPotionHeal(30, perks), " HP (", potions.small, ")"),
                potions.medium > 0 && React.createElement("button", { onClick: function () { onHeal("medium", getPotionHeal(60, perks)); }, style: { padding: "6px 12px", background: "#0d2a0d", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 12 } },
                    "⚗️ +", getPotionHeal(60, perks), " HP (", potions.medium, ")"),
                potions.large > 0 && React.createElement("button", { onClick: function () { onHeal("large", getPotionHeal(100, perks)); }, style: { padding: "6px 12px", background: "#0d2a0d", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 12 } },
                    "🫙 +", getPotionHeal(100, perks), " HP (", potions.large, ")")))),
        inventory.length > 0 && React.createElement("div", { style: S.sec }, "🎒 Items (", inventory.length, ")"),
        inventory.map(function (it) {
            var col = it.rarity ? RARITY_COLOR[it.rarity] : TIER_COLOR[it.tier] || "#c8a44a";
            var tLabel = it.rarity ? it.rarity.toUpperCase() : ("★".repeat(it.tier || 1));
            var leftBorder = it.rarity ? RARITY_COLOR[it.rarity] : (TIER_COLOR[it.tier] || "#4a3a1a");
            return React.createElement("div", { key: it.uid, style: Object.assign({}, S.row, { boxShadow: it.rarity ? RARITY_GLOW[it.rarity] : "none", borderLeft: "3px solid " + leftBorder }) },
                React.createElement("div", { style: { width: 36, height: 36, flexShrink: 0, display:"flex", alignItems:"center", justifyContent:"center", background:"#0d0801", borderRadius:6, border:"1px solid " + leftBorder + "66" } },
                    React.createElement(PixelIcon, { name: it.id, size: 26, fallback: SLOT_EMOJI[it.slot] })),
                React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 12, color: col } },
                        it.name, " ", React.createElement("span", { style: { fontSize: 9 } }, tLabel)),
                    React.createElement("div", { style: { color: "#7a6030", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, it.desc),
                    ItemBadges(it),
                    React.createElement("div", { style: { fontSize: 10, color: col, marginTop: 1 } }, Object.keys(it.stats).map(function (s) { return "+" + it.stats[s] + " " + s.toUpperCase(); }).join(" · "))),
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 } },
                    React.createElement("button", { onClick: function () { onEquip(it); }, style: S.btn }, T("Załóż", "Equip")),
                    React.createElement("button", { onClick: function () { SFX.sell(); onSell(it); }, style: Object.assign({}, S.btn, { color: "#f0c060", borderColor: "#5a4810" }) },
                        "💰 ", getSellPrice(it), "g"))); })));
}
