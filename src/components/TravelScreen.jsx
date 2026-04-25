import React, { useEffect } from 'react';
import { QUEST_ENEMIES, RARITY_COLOR } from '../data.js';
import { S, ANIM_CSS } from '../styles.js';
import { SFX } from '../audio.js';
import { PixelIcon } from './icons.jsx';
import { enemyIconKey } from './icons.jsx';

export function TravelScreen({ ts, onSkip }) {
    var isDungeon = ts.target === "dungeon";
    var name = isDungeon ? ts.data.dungeon.name : ts.data.quest.name;
    var enemy = isDungeon ? ts.data.dungeon.sections[0].enemy : QUEST_ENEMIES[ts.data.quest.id];
    var pct = (1 - ts.timeLeft / ts.totalTime) * 100;
    useEffect(function() { if (ts.timeLeft > 0 && ts.timeLeft < ts.totalTime) SFX.step(); }, [ts.timeLeft]);
    return React.createElement("div", { style: Object.assign({}, S.overlay, { justifyContent: "center", alignItems: "center", textAlign: "center", padding: 24 }) },
        React.createElement("style", null, ANIM_CSS),
        React.createElement("div", { style: { fontSize: 11, color: "#7a6030", textTransform: "uppercase", letterSpacing: 2, marginBottom: 5 } }, "Travelling to"),
        React.createElement("div", { style: { fontSize: 20, fontWeight: "bold", marginBottom: 4 } }, name),
        isDungeon && React.createElement("div", { style: { fontSize: 12, color: RARITY_COLOR[ts.data.dungeon.lootTable], marginBottom: 8 } }, "★ ", ts.data.dungeon.lootTable, " loot awaits ★"),
        React.createElement("div", { style: { display:"flex", justifyContent:"center", margin: "12px 0 6px" } },
            React.createElement("div", { style: { width:64, height:64, background:"#150e04", borderRadius:12, border:"1px solid #3e2808", display:"flex", alignItems:"center", justifyContent:"center", animation:"bob 2.2s ease-in-out infinite" } },
                React.createElement(PixelIcon, { name: enemyIconKey(enemy.name), size: 50, fallback: enemy.emoji }))),
        React.createElement("div", { style: { fontSize: 13, color: "#9a7030", marginBottom: 14 } },
            React.createElement("strong", null, enemy.name), " guards the way"),
        React.createElement("div", { style: { background: "#1a1208", borderRadius: 6, overflow: "hidden", height: 13, border: "1px solid #3e2808", marginBottom: 6, width: "100%", maxWidth: 240, margin: "0 auto 6px" } },
            React.createElement("div", { style: { width: pct + "%", height: "100%", background: "linear-gradient(90deg,#5a3a10,#c8a44a)", transition: "width 1s linear", animation: "travelPulse 1s ease-in-out infinite" } })),
        React.createElement("div", { style: { fontSize: 13, color: "#7a6030", marginBottom: 20 } }, "⏳ ", ts.timeLeft, "s"),
        React.createElement("button", { onClick: function() { SFX.enter(); onSkip(); }, style: Object.assign({}, S.bigBtn, { border: "2px solid #6a5020", color: "#9a7030", fontSize: 12 }) },
            "⏩ Skip Travel ", React.createElement("span", { style: { fontSize: 10, color: "#5a4020" } }, "[ALPHA]")));
}
