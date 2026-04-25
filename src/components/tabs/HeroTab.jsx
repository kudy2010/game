import React, { useState, useRef, useEffect } from 'react';
import { CLASSES, PERKS, STAT_COLOR, SLOT_EMOJI, RARITY_COLOR, T } from '../../data.js';
import { getPotionHeal, totalPotions } from '../../utils.js';
import { S } from '../../styles.js';
import { HpBar } from '../HpBar.jsx';
import { PixelIcon, CharSprite, classIconKey } from '../icons.jsx';

export function HeroTab(props) {
    var hero = props.hero, equipped = props.equipped, stats = props.stats, potions = props.potions;
    var onUnequip = props.onUnequip, onHeal = props.onHeal;
    var hpPct = hero.hp / hero.maxHp * 100;
    var xpPct = hero.xp / hero.xpNeeded * 100;
    var perks = hero.perks || [];
    var _hov = useState(null);
    var hovPerk = _hov[0];
    var setHovPerk = _hov[1];
    var _st = useState(null);
    var hovStat = _st[0];
    var setHovStat = _st[1];
    var statTipTimer = useRef(null);
    function statTipText(st) {
        if (st === "str") return "⚔️ STR (Siła): Zwiększa obrażenia zadawane bronią białą oraz siłę blokowania ataków.";
        if (st === "agi") return "🏃 AGI (Zręczność): Zwiększa szansę na trafienie, unik i inicjatywę w walce.";
        if (st === "int") return "🧠 INT (Inteligencja): Zwiększa obrażenia od prochu, granatów i alchemii oraz szansę na trafienie krytyczne.";
        if (st === "con") return "❤️ CON (Wytrzymałość): Zwiększa maksymalne punkty życia oraz ogólną odporność na obrażenia.";
        return "";
    }
    function statAbbr(st) {
        if (st === "str") return "STR";
        if (st === "agi") return "AGI";
        if (st === "int") return "INT";
        if (st === "con") return "CON";
        return st.toUpperCase();
    }
    function toggleStatTip(st) {
        clearTimeout(statTipTimer.current);
        setHovStat(function (cur) { return cur === st ? null : st; });
        statTipTimer.current = setTimeout(function () { setHovStat(null); }, 4000);
    }
    useEffect(function () { return function () { clearTimeout(statTipTimer.current); }; }, []);
    return (React.createElement("div", null,
        React.createElement("div", { style: S.card },
            React.createElement("div", { style: { textAlign: "center", marginBottom: 10 } },
                React.createElement("div", { style: { marginBottom: 6, display: "flex", justifyContent: "center" } },
                    React.createElement(CharSprite, { iconKey: classIconKey(hero.class), emoji: CLASSES[hero.class].emoji, size: 72 })),
                React.createElement("div", { style: { fontSize: 17, fontWeight: "bold" } }, hero.name),
                React.createElement("div", { style: { color: "#7a6030", fontSize: 11, marginBottom: 8 } },
                    CLASSES[hero.class].name, " · Poziom ", hero.level),
                React.createElement("div", { style: { marginBottom: 6 } },
                    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 9, color: "#5a4820", marginBottom: 2 } },
                        React.createElement("span", null, "❤️ HP"),
                        React.createElement("span", { style: { color: hpPct < 30 ? "#dd4444" : "#7a6030" } }, hero.hp, " / ", hero.maxHp)),
                    React.createElement(HpBar, { pct: hpPct, height: 12 })),
                React.createElement("div", null,
                    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 9, color: "#5a4820", marginBottom: 2 } },
                        React.createElement("span", null, "✨ XP"),
                        React.createElement("span", null, hero.xp, " / ", hero.xpNeeded)),
                    React.createElement("div", { style: { background: "#0a0604", borderRadius: 4, overflow: "hidden", height: 10, border: "1px solid #2e1e08", position: "relative" } },
                        React.createElement("div", { style: { width: xpPct + "%", height: "100%", background: "linear-gradient(90deg,#5a3808,#e0b040,#f8d060)", transition: "width 0.5s", position: "relative", overflow: "hidden" } },
                            React.createElement("div", { style: { position: "absolute", top: 0, left: 0, height: "100%", width: "30%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)", animation: "xpShine 2.8s ease-in-out infinite" } })))),
                React.createElement("div", { style: { display: "flex", gap: 6, justifyContent: "center", marginTop: 8, flexWrap: "wrap" } },
                    totalPotions(potions) > 0 && hero.hp < hero.maxHp && (React.createElement(React.Fragment, null,
                        potions.small > 0 && React.createElement("button", { onClick: function () { onHeal("small", getPotionHeal(30, perks)); }, style: { padding: "4px 9px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10 } },
                            "🧪 +", getPotionHeal(30, perks), " (", potions.small, ")"),
                        potions.medium > 0 && React.createElement("button", { onClick: function () { onHeal("medium", getPotionHeal(60, perks)); }, style: { padding: "4px 9px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10 } },
                            "⚗️ +", getPotionHeal(60, perks), " (", potions.medium, ")"),
                        potions.large > 0 && React.createElement("button", { onClick: function () { onHeal("large", getPotionHeal(100, perks)); }, style: { padding: "4px 9px", background: "#0a1e0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10 } },
                            "🫙 +", getPotionHeal(100, perks), " (", potions.large, ")"))))),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 } }, ["str", "agi", "int", "con"].map(function (st) {
                var sc = STAT_COLOR[st];
                var isH = hovStat === st;
                return (React.createElement("div", { key: st, style: { position: "relative" }, onMouseEnter: function () { setHovStat(st); }, onMouseLeave: function () { setHovStat(null); }, onTouchStart: function (e) { e.preventDefault(); toggleStatTip(st); } },
                    React.createElement("div", { style: { background: "linear-gradient(180deg,#0f0a02,#0b0701)", border: "1px solid " + (isH ? "#c8a44a" : sc + "33"), borderRadius: 10, padding: "10px 8px", textAlign: "center", boxShadow: isH ? "0 10px 22px rgba(0,0,0,0.65), 0 0 16px rgba(200,164,74,0.16), inset 0 0 14px " + sc + "10" : "0 8px 18px rgba(0,0,0,0.55), inset 0 0 12px " + sc + "0a", transition: "transform .12s ease, box-shadow .12s ease, border-color .12s ease", cursor: "help", userSelect: "none" } },
                        React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", justifyContent: "center", color: isH ? "#f0c060" : sc + "aa", fontSize: 10, letterSpacing: 0.45, textTransform: "uppercase" } },
                            React.createElement(PixelIcon, { name: st, size: 24 }),
                            React.createElement("span", null, statAbbr(st))),
                        React.createElement("div", { style: { fontSize: 22, fontWeight: "bold", color: sc, textShadow: "0 0 10px " + sc + "44" } }, stats[st] || 0),
                        React.createElement("div", { style: { height: 6 } })),
                    isH && React.createElement("div", { className: "ps-tip" },
                        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#f0c060", fontWeight: "bold", marginBottom: 4, letterSpacing: 0.3 } },
                            React.createElement(PixelIcon, { name: st, size: 20 }),
                            React.createElement("span", null, statAbbr(st))),
                        React.createElement("div", { style: { fontSize: 10.5, color: "#c8a44a", lineHeight: 1.35 } }, statTipText(st)))));
            })),
            (potions.small > 0 || potions.medium > 0 || potions.large > 0) && React.createElement("div", { style: { marginTop: 7, background: "#0d0801", border: "1px solid #2e1e08", borderRadius: 5, padding: "5px 8px", display: "flex", gap: 10, justifyContent: "center" } },
                potions.small > 0 && React.createElement("span", { style: { fontSize: 11, color: "#44dd88" } }, "🧪×", potions.small),
                potions.medium > 0 && React.createElement("span", { style: { fontSize: 11, color: "#44dd88" } }, "⚗️×", potions.medium),
                potions.large > 0 && React.createElement("span", { style: { fontSize: 11, color: "#44dd88" } }, "🫙×", potions.large))),
        perks.length > 0 && React.createElement("div", { style: S.card },
            React.createElement("div", { style: S.sec }, "✨ Perki (", perks.length, ")"),
            React.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap" } }, perks.map(function (pid) {
                var p = PERKS.find(function (x) { return x.id === pid; });
                if (!p) return null;
                var isH = hovPerk === pid;
                return (React.createElement("div", { key: pid, style: { position: "relative" }, onMouseEnter: function () { setHovPerk(pid); }, onMouseLeave: function () { setHovPerk(null); }, onTouchStart: function () { setHovPerk(isH ? null : pid); } },
                    React.createElement("div", { style: { padding: "4px 10px", background: isH ? "#2a1e0a" : "#1a1208", border: "1px solid " + (isH ? "#c8a44a" : "#3a2808"), borderRadius: 5, fontSize: 11, color: isH ? "#f0c060" : "#c8a44a", cursor: "default", transition: "all 0.15s", boxShadow: isH ? "0 0 8px rgba(200,164,74,0.18)" : "none" } },
                        p.emoji, " ", p.name),
                    isH && React.createElement("div", { style: { position: "absolute", bottom: "110%", left: "50%", transform: "translateX(-50%)", background: "#1e1508", border: "1px solid #c8a44a", borderRadius: 7, padding: "8px 11px", zIndex: 100, width: 160, textAlign: "center", boxShadow: "0 4px 18px rgba(0,0,0,0.7)", pointerEvents: "none" } },
                        React.createElement("div", { style: { fontSize: 20, marginBottom: 3 } }, p.emoji),
                        React.createElement("div", { style: { fontSize: 12, fontWeight: "bold", color: "#f0c060", marginBottom: 3 } }, p.name),
                        React.createElement("div", { style: { fontSize: 10, color: "#9a8040", lineHeight: 1.35 } }, p.desc),
                        React.createElement("div", { style: { position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #c8a44a" } }))));
            }))),
        React.createElement("div", { style: S.sec }, "🎽 Ekwipunek"),
        Object.keys(SLOT_EMOJI).map(function (slot) { var it = equipped[slot]; return React.createElement("div", { key: slot, style: Object.assign({}, S.row, { opacity: it ? 1 : 0.45 }) },
            React.createElement(PixelIcon, { name: slot, size: 24, style: it ? {} : { opacity: 0.45, filter: "grayscale(1) brightness(0.85) drop-shadow(0 1px 2px rgba(0,0,0,0.6))" } }),
            React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement("div", { style: { fontWeight: "bold", fontSize: 12, color: it && it.rarity ? RARITY_COLOR[it.rarity] : "#c8a44a" } }, it ? it.name : "Empty " + slot),
                it && React.createElement("div", { style: { color: "#7a6030", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, it.desc),
                it && React.createElement("div", { style: { fontSize: 10, color: it.rarity ? RARITY_COLOR[it.rarity] : "#c8a44a", marginTop: 1 } }, Object.keys(it.stats).map(function (s) { return "+" + it.stats[s] + " " + s.toUpperCase(); }).join(" · "))),
            it && React.createElement("button", { onClick: function () { onUnequip(slot); }, style: S.btn }, "Remove")); })));
}
