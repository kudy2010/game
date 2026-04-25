import React from 'react';
import {
    clamp, rng, PERKS, CLASSES, DUNGEON_ITEMS, ITEMS,
    DMG_TYPE_LABEL, DMG_TYPE_COLOR, CLASS_TAG_INFO,
} from './data.js';

// ── COMBAT ────────────────────────────────────────────────────────────────────
export function rollRound(atkS, defS, forceHit) {
    if (!forceHit && Math.random() * 100 > clamp(60 + (atkS.agi - defS.agi) * 4 + (atkS._hitBonus || 0), 20, 95))
        return { type: "miss", dmg: 0 };
    if (Math.random() * 100 < clamp((defS.agi - atkS.agi) * 3 + (defS._dodgeBonus || 0), 0, 32))
        return { type: "dodge", dmg: 0 };
    var blocked = Math.random() * 100 < clamp(defS.con * 2 + (defS._blockBonus || 0), 0, 28);
    var crit    = Math.random() * 100 < clamp(atkS.agi * 2 + (atkS._critBonus || 0), 5, 50);
    var base;
    var cls = atkS._class;
    if      (cls === "knight")    base = (atkS.str||0)*4   + (atkS.con||0)*1;
    else if (cls === "musketeer") base = (atkS.agi||0)*3.5 + (atkS.str||0)*1;
    else if (cls === "alchemist") base = (atkS.int||0)*3.5 + (atkS.agi||0)*1;
    else                          base = (atkS.str||0)*3   + (atkS.agi||0)*1 + (atkS.int||0)*2;
    var prefType = cls && CLASSES[cls] && CLASSES[cls].preferredType;
    if (prefType && atkS._weaponDmgType && prefType === atkS._weaponDmgType) base *= 1.2;
    var dmg = Math.max(1, rng(Math.floor(base * 0.8), Math.floor(base * 1.2)) - (defS.con||0) * 2);
    if (blocked) dmg = Math.max(1, Math.floor(dmg * 0.42));
    if (crit)    dmg = Math.floor(dmg * (1.6 + (atkS.int||0) * 0.04));
    return { type: crit ? "crit" : blocked ? "block" : "hit", dmg: dmg };
}

export function computeStats(hero, eq) {
    var s = Object.assign({}, hero.stats);
    s._class = hero.class;
    s._weaponDmgType = (eq && eq.weapon && eq.weapon.dmgType) ? eq.weapon.dmgType : null;
    Object.values(eq).forEach(function(it) {
        if (!it) return;
        Object.keys(it.stats).forEach(function(k) { s[k] = (s[k] || 0) + it.stats[k]; });
    });
    (hero.perks || []).forEach(function(pid) {
        var p = PERKS.find(function(x) { return x.id === pid; });
        if (p && p.sB) Object.keys(p.sB).forEach(function(k) { s[k] = (s[k] || 0) + p.sB[k]; });
    });
    return s;
}

// ── LOOT / ITEMS ──────────────────────────────────────────────────────────────
export function getDungeonLoot(d) {
    var pool = DUNGEON_ITEMS.filter(function(it) { return it.rarity === d.lootTable; });
    return Object.assign({}, pool[rng(0, pool.length - 1)], { uid: Date.now() + Math.random() });
}
export function getSellPrice(it) { return it.sellPrice || Math.max(5, Math.floor(it.price * 0.35)); }
export function totalPotions(p) { return (p.small || 0) + (p.medium || 0) + (p.large || 0); }
export function fmtCooldown(ms) { var s = Math.ceil(ms / 1000), m = Math.floor(s / 60); return m + ":" + (s % 60 < 10 ? "0" : "") + s % 60; }
export function getPotionHeal(baseHeal, perks) {
    var bonus = 0;
    (perks || []).forEach(function(pid) {
        var p = PERKS.find(function(x) { return x.id === pid; });
        if (p && p.potionBonus) bonus += p.potionBonus;
    });
    return Math.floor(baseHeal * (1 + bonus));
}

// ── XP / LEVEL UP ─────────────────────────────────────────────────────────────
export function applyXpForLevelUp(prev, xpG) {
    var xpFor = function(l) { return Math.floor(100 * Math.pow(1.5, l - 1)); };
    var xp = prev.xp + xpG, lv = prev.level, leveled = 0;
    while (xp >= xpFor(lv)) { xp -= xpFor(lv); lv++; leveled++; }
    var nh = Object.assign({}, prev, { xp: xp, level: lv, xpNeeded: xpFor(lv) });
    if (!leveled) return { hero: nh, luInfo: null };
    var perkLv = null;
    for (var l = lv; l > prev.level; l--) { if (l % 3 === 0) { perkLv = l; break; } }
    var perkChoices = null;
    if (perkLv !== null) {
        var acq = prev.perks || [];
        var avail = PERKS.filter(function(p) { return acq.indexOf(p.id) === -1; });
        if (avail.length > 0) {
            var sh = avail.slice().sort(function() { return Math.random() - 0.5; });
            perkChoices = sh.slice(0, Math.min(3, sh.length)).map(function(p) { return p.id; });
        }
    }
    return { hero: nh, luInfo: { level: lv, perkChoices: perkChoices, points: leveled * 2 } };
}

// ── ITEM BADGES (React component-function) ────────────────────────────────────
export function ItemBadges(it) {
    var nodes = [];
    if (it.dmgType) nodes.push(React.createElement("span", { key:"dt", style:{ fontSize:8, color:DMG_TYPE_COLOR[it.dmgType], background:"#0d0801", border:"1px solid "+DMG_TYPE_COLOR[it.dmgType]+"55", borderRadius:3, padding:"1px 4px", whiteSpace:"nowrap" } }, DMG_TYPE_LABEL[it.dmgType]));
    if (it.classTag) { var ct = CLASS_TAG_INFO[it.classTag]; if(ct) nodes.push(React.createElement("span", { key:"ct", style:{ fontSize:8, color:ct.color, background:ct.bg, border:"1px solid "+ct.color+"55", borderRadius:3, padding:"1px 4px", whiteSpace:"nowrap" } }, ct.label)); }
    if (!nodes.length) return null;
    return React.createElement("div", { style:{ display:"flex", gap:3, marginTop:2, flexWrap:"wrap" } }, nodes);
}
