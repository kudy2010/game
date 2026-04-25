import React from 'react';
import { STAT_COLOR } from '../data.js';
import { HpBar } from './HpBar.jsx';
import { PixelIcon, CharSprite } from './icons.jsx';

export function FighterPanel({ side, name, emoji, iconKey, curHp, maxHp, stats, animState, floats = [], flash, reaction, isBoss }) {
    var pct = Math.max(0, Math.min(100, curHp / maxHp * 100));
    var isHero = side === "hero";
    var fa = flash === "red" ? "flashRed 0.5s ease" : flash === "gold" ? "flashGold 0.5s ease" : flash === "heal" ? "healFlash 0.6s ease" : "";
    var frameCol  = isBoss ? "#cc3333" : isHero ? "#c8a44a" : "#5a3a1a";
    var frameBg   = isBoss ? "linear-gradient(180deg,#1e0606,#100404)" : isHero ? "linear-gradient(180deg,#120d04,#0d0801)" : "linear-gradient(180deg,#0e0c06,#080601)";
    var innerGlow = isBoss ? "inset 0 0 22px rgba(200,40,40,0.18)" : isHero ? "inset 0 0 22px rgba(200,164,74,0.10)" : "inset 0 0 18px rgba(0,0,0,0.6)";
    var bossAnim  = isBoss ? ", bossPulse 2s ease-in-out infinite" : "";
    return React.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 } },
        React.createElement("div", { style: { position: "relative", height: 130, borderRadius: 10, border: "2px solid " + frameCol, background: frameBg, boxShadow: innerGlow + ", 0 6px 20px rgba(0,0,0,0.7)", overflow: "hidden", animation: fa + bossAnim, flexShrink: 0 } },
            React.createElement("div", { style: { position:"absolute", top: 3, left: 3, width: 10, height: 10, borderTop: "2px solid " + frameCol, borderLeft: "2px solid " + frameCol, borderRadius:"3px 0 0 0", opacity:0.7 } }),
            React.createElement("div", { style: { position:"absolute", top: 3, right: 3, width: 10, height: 10, borderTop: "2px solid " + frameCol, borderRight: "2px solid " + frameCol, borderRadius:"0 3px 0 0", opacity:0.7 } }),
            React.createElement("div", { style: { position:"absolute", bottom: 3, left: 3, width: 10, height: 10, borderBottom: "2px solid " + frameCol, borderLeft: "2px solid " + frameCol, borderRadius:"0 0 0 3px", opacity:0.7 } }),
            React.createElement("div", { style: { position:"absolute", bottom: 3, right: 3, width: 10, height: 10, borderBottom: "2px solid " + frameCol, borderRight: "2px solid " + frameCol, borderRadius:"0 0 3px 0", opacity:0.7 } }),
            React.createElement("div", { style: { position:"absolute", bottom:0, left:0, right:0, height:28, background:"linear-gradient(0deg,rgba(0,0,0,0.65),transparent)", pointerEvents:"none", zIndex:1 } }),
            floats.filter(function(f) { return f.side === side; }).map(function(f) {
                return React.createElement("div", { key: f.id, style: { position:"absolute", left:"50%", top:"22%", color:f.color, fontWeight:"bold", fontSize: f.big ? 22 : 15, animation:"dmgUp 1.1s ease forwards", zIndex:30, whiteSpace:"nowrap", textShadow:"0 2px 10px #000, 0 0 6px " + f.color, pointerEvents:"none", transform:"translateX(-50%)" } }, f.text);
            }),
            isBoss && React.createElement("div", { style: { position:"absolute", top:5, left:"50%", transform:"translateX(-50%)", background:"#3a0000", border:"1px solid #cc3333", borderRadius:4, fontSize:8, color:"#ff6644", padding:"1px 6px", letterSpacing:1, zIndex:10, whiteSpace:"nowrap" } }, "⚠ BOSS"),
            reaction && React.createElement("div", { style: { position:"absolute", top:5, left:"50%", transform:"translateX(-50%)", background:"rgba(20,12,2,0.92)", border:"1px solid #c8a44a88", borderRadius:8, padding:"3px 8px", fontSize:9, color:"#f0d060", maxWidth:"90%", wordBreak:"break-word", animation:"bubble 2.4s ease forwards", lineHeight:1.35, zIndex:25, whiteSpace:"nowrap", textOverflow:"ellipsis", overflow:"hidden" } }, reaction),
            React.createElement("div", { style: { position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" } },
                React.createElement(CharSprite, { iconKey: iconKey, emoji: emoji, size: 96, animState: animState, side: side }))),
        React.createElement("div", { style: { textAlign:"center", fontSize:11, fontWeight:"bold", color: isBoss ? "#ff9966" : isHero ? "#f0d080" : "#c8a44a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", letterSpacing:0.3 } }, name),
        React.createElement(HpBar, { pct: pct, height: 11, showText: true, cur: curHp, max: maxHp }),
        React.createElement("div", { style: { display:"flex", gap:2 } }, ["str","agi","int","con"].map(function(st) {
            var sc = STAT_COLOR[st];
            return React.createElement("div", { key:st, style:{ flex:1, background:"#0d0801", border:"1px solid "+sc+"22", borderRadius:4, padding:"2px 1px", textAlign:"center" } },
                React.createElement(PixelIcon, { name:st, size:14 }),
                React.createElement("div", { style:{ fontSize:10, fontWeight:"bold", color:sc, lineHeight:1.1 } }, stats[st]||0));
        })));
}
