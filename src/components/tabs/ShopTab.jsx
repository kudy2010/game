import React, { useState, useEffect } from 'react';
import { ITEMS, DUNGEON_ITEMS, POTIONS, RARITY_COLOR, RARITY_GLOW, TIER_COLOR, SLOT_EMOJI, CLASS_TAG_INFO, rng, T } from '../../data.js';
import { fmtCooldown, ItemBadges } from '../../utils.js';
import { S } from '../../styles.js';
import { SFX } from '../../audio.js';
import { PixelIcon } from '../icons.jsx';

export function ShopTab(props) {
    var items = props.items || ITEMS, gold = props.gold, potions = props.potions, onBuy = props.onBuy, onBuyPotion = props.onBuyPotion;
    var shopPool = props.shopPool, setShopPool = props.setShopPool, shopSpecial = props.shopSpecial, setShopSpecial = props.setShopSpecial, shopRefreshAt = props.shopRefreshAt, setShopRefreshAt = props.setShopRefreshAt;
    var heroClass = props.heroClass, equipped = props.equipped || {};
    function StatDiff(it) {
        var cur = equipped[it.slot];
        if (!cur) return null;
        var allKeys = Array.from(new Set(Object.keys(it.stats).concat(Object.keys(cur.stats))));
        var diffs = allKeys.map(function(k) {
            var delta = (it.stats[k] || 0) - (cur.stats[k] || 0);
            return delta !== 0 ? { k: k, delta: delta } : null;
        }).filter(Boolean);
        if (!diffs.length) return null;
        return React.createElement("div", { style: { display:"flex", gap:3, flexWrap:"wrap", marginTop:2 } },
            diffs.map(function(d) {
                var col = d.delta > 0 ? "#44dd88" : "#ff6655";
                var sign = d.delta > 0 ? "+" : "";
                return React.createElement("span", { key:d.k, style:{ fontSize:8, color:col, background:"#0d0801", border:"1px solid "+col+"44", borderRadius:3, padding:"1px 4px" } },
                    sign + d.delta + " " + d.k.toUpperCase());
            }));
    }
    var REFRESH_MS = 15 * 60 * 1000;
    var _tick = useState(0);
    var setTick = _tick[1];
    var _f = useState("all");
    var filter = _f[0];
    var setFilter = _f[1];
    useEffect(function () { var cdLeft = shopRefreshAt ? Math.max(0, shopRefreshAt + REFRESH_MS - Date.now()) : 0; if (!cdLeft) return; var id = setInterval(function () { setTick(function (n) { return n + 1; }); }, 1000); return function () { clearInterval(id); }; }, [shopRefreshAt]);
    useEffect(function () { if (!shopPool) doRefresh(false); }, []);
    function doRefresh(withSound) {
        var sh = items.slice().sort(function () { return Math.random() - 0.5; });
        setShopPool(sh.slice(0, 9));
        var roll = Math.random();
        var rarity = roll < 0.02 ? "legendary" : roll < 0.1 ? "epic" : roll < 0.33 ? "rare" : null;
        var sp = null;
        if (rarity) {
            var sP = DUNGEON_ITEMS.filter(function (i) { return i.rarity === rarity; });
            var it = sP[rng(0, sP.length - 1)];
            var mult = rarity === "legendary" ? 2.5 : rarity === "epic" ? 2.2 : 2.0;
            sp = Object.assign({}, it, { shopPrice: Math.floor(it.sellPrice * mult) });
            if (withSound) setTimeout(SFX.rareItem, 300);
        }
        setShopSpecial(sp);
        setShopRefreshAt(Date.now());
    }
    var cdLeft = shopRefreshAt ? Math.max(0, shopRefreshAt + REFRESH_MS - Date.now()) : 0;
    var canRefresh = cdLeft <= 0;
    var displayPool = shopPool || items.slice(0, 9);
    var slots = ["all", "weapon", "helmet", "armor", "boots", "accessory"];
    var filtered = filter === "myclass"
        ? displayPool.filter(function (i) { return !i.classTag || i.classTag === heroClass; })
        : filter === "all" ? displayPool : displayPool.filter(function (i) { return i.slot === filter; });
    var ctInfo = heroClass && CLASS_TAG_INFO[heroClass];
    return (React.createElement("div", null,
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 9, background: "#150e04", border: "1px solid #2e1e08", borderRadius: 6, padding: "6px 10px" } },
            React.createElement("div", { style: { flex: 1, fontSize: 11, color: canRefresh ? "#44dd88" : "#7a6030" } }, canRefresh ? "✅ Nowy towar dostępny!" : "⏳ Restockuje za " + fmtCooldown(cdLeft)),
            React.createElement("button", { onClick: function () { if (canRefresh) { SFX.buy(); doRefresh(true); } }, disabled: !canRefresh, style: { padding: "4px 9px", background: canRefresh ? "#0a2a0a" : "#1e1206", border: "1px solid " + (canRefresh ? "#2a6a2a" : "#4a3210"), color: canRefresh ? "#44dd88" : "#7a6030", fontFamily: "Georgia,serif", cursor: canRefresh ? "pointer" : "default", borderRadius: 4, fontSize: 11, opacity: canRefresh ? 1 : 0.6 } }, "🔄 Odśwież"),
            React.createElement("button", { onClick: function () { SFX.buy(); doRefresh(true); }, style: { padding: "4px 7px", background: "#1e1a06", border: "1px solid #aa7000", color: "#ffaa00", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 10 } }, "⚡[α]")),
        shopSpecial && React.createElement("div", { style: { background: "#150e04", border: "2px solid " + RARITY_COLOR[shopSpecial.rarity], borderRadius: 8, padding: 10, marginBottom: 10, boxShadow: RARITY_GLOW[shopSpecial.rarity] } },
            React.createElement("div", { style: { fontSize: 10, color: RARITY_COLOR[shopSpecial.rarity], textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 } },
                "★ Rzadka Oferta — ", shopSpecial.rarity),
            React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } },
                React.createElement("div", { style: { width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", background:"#0d0801", borderRadius:6, border:"2px solid " + RARITY_COLOR[shopSpecial.rarity], boxShadow: RARITY_GLOW[shopSpecial.rarity] } },
                    React.createElement(PixelIcon, { name: shopSpecial.id, size: 28, fallback: SLOT_EMOJI[shopSpecial.slot] })),
                React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 12, color: RARITY_COLOR[shopSpecial.rarity] } }, shopSpecial.name),
                    React.createElement("div", { style: { color: "#7a6030", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, shopSpecial.desc),
                    React.createElement("div", { style: { fontSize: 10, color: RARITY_COLOR[shopSpecial.rarity], marginTop: 1 } }, Object.keys(shopSpecial.stats).map(function (s) { return "+" + shopSpecial.stats[s] + " " + s.toUpperCase(); }).join(" · "))),
                React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
                    React.createElement("div", { style: { fontSize: 11, color: "#f0c060", marginBottom: 3 } }, "💰 ", shopSpecial.shopPrice),
                    React.createElement("button", { onClick: function () { if (gold >= shopSpecial.shopPrice) { SFX.rareItem(); onBuy(Object.assign({}, shopSpecial, { price: shopSpecial.shopPrice })); setShopSpecial(null); } }, disabled: gold < shopSpecial.shopPrice, style: Object.assign({}, S.btn, { borderColor: RARITY_COLOR[shopSpecial.rarity], color: RARITY_COLOR[shopSpecial.rarity], opacity: gold >= shopSpecial.shopPrice ? 1 : 0.35 }) }, T("Kup", "Buy"))))),
        React.createElement("div", { style: S.sec }, T("🛒 Ekwipunek", "🛒 Equipment")),
        React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 9, flexWrap: "wrap" } },
            ctInfo && React.createElement("button", { onClick: function () { setFilter("myclass"); }, style: { background: filter === "myclass" ? ctInfo.bg : "#150e04", border: "2px solid " + (filter === "myclass" ? ctInfo.color : ctInfo.color + "44"), color: ctInfo.color, padding: "4px 7px", fontSize: 10, fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontWeight: "bold" } }, ctInfo.label),
            slots.map(function (s) { return React.createElement("button", { key: s, onClick: function () { setFilter(s); }, style: { background: filter === s ? "#2e1e08" : "#150e04", border: "1px solid " + (filter === s ? "#c8a44a" : "#4a3210"), color: "#c8a44a", padding: "4px 7px", fontSize: 10, fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, display:"flex", alignItems:"center", gap: 4 } },
                s === "all" ? T("📦 Wszystkie", "📦 All") : React.createElement(React.Fragment, null, React.createElement(PixelIcon, { name: s, size: 16, fallback: SLOT_EMOJI[s] }), " ", s)); })),
        filtered.map(function (it) {
            var ok = gold >= it.price;
            var tierBorder = it.tier ? TIER_COLOR[it.tier] : "#2e1e08";
            return React.createElement("div", { key: it.id, style: Object.assign({}, S.row, { opacity: ok ? 1 : 0.55, borderLeft: "3px solid " + tierBorder }) },
                React.createElement("div", { style: { width: 34, height: 34, flexShrink: 0, display:"flex", alignItems:"center", justifyContent:"center", background:"#0d0801", borderRadius:6, border:"1px solid rgba(200,164,74,0.14)" } },
                    React.createElement(PixelIcon, { name: it.id, size: 26, fallback: SLOT_EMOJI[it.slot] })),
                React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 12 } },
                        it.name, " ", React.createElement("span", { style: { fontSize: 9, color: TIER_COLOR[it.tier] || "#9a7a30" } }, it.tier ? ("★".repeat(it.tier)) : "")),
                    React.createElement("div", { style: { color: "#7a6030", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, it.desc),
                    ItemBadges(it),
                    React.createElement("div", { style: { fontSize: 10, color: "#c8a44a", marginTop: 1 } }, Object.keys(it.stats).map(function (s) { return "+" + it.stats[s] + " " + s.toUpperCase(); }).join(" · ")),
                    StatDiff(it)),
                React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
                    React.createElement("div", { style: { fontSize: 11, color: "#f0c060", marginBottom: 3 } }, "💰 ", it.price),
                    React.createElement("button", { onClick: function () { if (ok) { SFX.buy(); onBuy(it); } }, disabled: !ok, style: Object.assign({}, S.btn, { opacity: ok ? 1 : 0.35 }) }, T("Kup", "Buy")))); }),
        React.createElement("div", { style: S.sec }, "🧪 Potions"),
        React.createElement("div", { style: { display: "flex", gap: 7, flexWrap: "wrap" } }, POTIONS.map(function (p) {
            var ok = gold >= p.price;
            var iconKey = p.id === "p1" ? "potion_small" : p.id === "p2" ? "potion_medium" : "potion_large";
            return React.createElement("div", { key: p.id, style: { flex: 1, minWidth: 80, background: "#0a1e0a", border: "1px solid " + (ok ? "#2a6a2a" : "#1a3a1a"), borderRadius: 7, padding: "8px 6px", textAlign: "center", opacity: ok ? 1 : 0.55 } },
                React.createElement("div", { style: { display:"flex", justifyContent:"center", marginBottom: 4 } },
                    React.createElement(PixelIcon, { name: iconKey, size: 28, fallback: p.emoji })),
                React.createElement("div", { style: { fontSize: 11, fontWeight: "bold", color: "#44dd88", marginBottom: 1 } }, p.name),
                React.createElement("div", { style: { fontSize: 10, color: "#3a7a3a", marginBottom: 3 } }, T("Leczy ", "Heals "), p.heal, " HP"),
                React.createElement("div", { style: { fontSize: 10, color: "#f0c060", marginBottom: 4 } }, "💰 ", p.price, "g"),
                React.createElement("button", { onClick: function () { if (ok) { SFX.buy(); onBuyPotion(p); } }, disabled: !ok, style: { padding: "4px 8px", background: ok ? "#1a3a1a" : "#0a1a0a", border: "1px solid #2a6a2a", color: "#44dd88", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 11, opacity: ok ? 1 : 0.35 } }, T("Kup", "Buy"))); }))));
}
