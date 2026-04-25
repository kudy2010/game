import React, { useState, useEffect } from 'react';
import { BEER_MAX, rng, T } from '../../data.js';
import { S } from '../../styles.js';
import { AM, TAVERN_AMB, SFX } from '../../audio.js';

export function TavernTab(props) {
    var gold = props.gold, onResult = props.onResult, onDrinkBeer = props.onDrinkBeer;
    var stamina = props.stamina || 0, pierogi = props.pierogi || 0;
    var beerStock = props.beerStock || 0, beerLastRestock = props.beerLastRestock || 0;
    var beerBuffUntil = props.beerBuffUntil || 0;
    var hasBeerBuff = Date.now() < beerBuffUntil;
    var beerBuffMins = Math.max(0, Math.ceil((beerBuffUntil - Date.now()) / 60000));
    var _amb = useState(false);
    var ambOn = _amb[0];
    var setAmbOn = _amb[1];
    useEffect(function () {
        AM.resume();
        TAVERN_AMB.start();
        setAmbOn(true);
        return function () { if (TAVERN_AMB.active()) TAVERN_AMB.stop(); };
    }, []);
    var _cup = useState({ bet: 20, phase: "idle", chosen: null, win: null });
    var cup = _cup[0];
    var setCup = _cup[1];
    var _dce = useState({ bet: 20, phase: "idle", pick: "high", r1: null, r2: null });
    var dce = _dce[0];
    var setDce = _dce[1];
    var _crd = useState({ bet: 20, phase: "idle", h: null, d: null });
    var crd = _crd[0];
    var setCrd = _crd[1];
    var toggleAmb = function () { AM.resume(); if (ambOn) { TAVERN_AMB.stop(); } else { TAVERN_AMB.start(); } setAmbOn(!ambOn); };
    var bS = { background: "#1e1206", border: "1px solid #4a3210", color: "#c8a44a", padding: "5px 9px", fontSize: 11, fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4 };
    var betBtn = Object.assign({}, bS, { padding: "3px 8px" });
    function adjBet(setter, d) { setter(function (p) { return Object.assign({}, p, { bet: Math.min(Math.min(gold, 500), Math.max(10, p.bet + d)) }); }); }
    var playCups = function (i) { if (cup.phase !== "idle" || gold < cup.bet) return; SFX.coin(); var w = rng(0, 2); var buffed = hasBeerBuff && Math.random() < 0.05; if (buffed) w = i; var profit = i === w ? Math.floor(cup.bet * 1.5) : -cup.bet; setCup(function (p) { return Object.assign({}, p, { phase: "done", chosen: i, win: w }); }); setTimeout(function () { onResult(profit); if (profit > 0) SFX.win(); }, 250); };
    var playDice = function () { if (dce.phase !== "idle" || gold < dce.bet) return; SFX.dice(); var r1 = rng(1, 6), r2 = rng(hasBeerBuff ? 2 : 1, 6), t = r1 + r2; var win = (dce.pick === "high" && t > 7) || (dce.pick === "low" && t < 7) || (dce.pick === "seven" && t === 7); var profit = win ? (dce.pick === "seven" ? dce.bet * 4 : Math.floor(dce.bet * 0.8)) : -dce.bet; setDce(function (p) { return Object.assign({}, p, { phase: "done", r1: r1, r2: r2 }); }); setTimeout(function () { onResult(profit); if (profit > 0) SFX.win(); }, 250); };
    var CARDS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    var playCard = function () { if (crd.phase !== "idle" || gold < crd.bet) return; SFX.cardFlip(); var hi = rng(hasBeerBuff ? 4 : 0, 12), di = rng(0, 12); var profit = hi > di ? Math.floor(crd.bet * 0.9) : hi === di ? 0 : -crd.bet; setCrd(function (p) { return Object.assign({}, p, { phase: "done", h: CARDS[hi], d: CARDS[di] }); }); setTimeout(function () { onResult(profit); if (profit > 0) SFX.win(); }, 250); };
    var reset = function (setter) { setter(function (p) { return Object.assign({}, p, { phase: "idle", chosen: null, win: null, r1: null, r2: null, h: null, d: null }); }); };
    var DF = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    var wC = "#44dd44", lC = "#dd4444";
    return (React.createElement("div", null,
        React.createElement("div", { style: { background: "linear-gradient(180deg,#0e0604,#180c06)", borderRadius: 8, padding: "10px 12px", marginBottom: 10, border: "1px solid #3a1808", textAlign: "center" } },
            React.createElement("div", { style: { fontSize: 11, color: "#4a2808", letterSpacing: 3 } }, "🕯️ ════════════════════ 🕯️"),
            React.createElement("div", { style: { fontSize: 16, letterSpacing: 2, color: "#8a5018", margin: "3px 0" } }, "🏺 🍺 🎲 🃏 🎰 🍺 🏺"),
            React.createElement("div", { style: { fontSize: 14, fontWeight: "bold", color: "#c8a44a", letterSpacing: 2 } }, T("PIJANA ARMATA", "THE TIPSY CANNON")),
            React.createElement("div", { style: { fontSize: 9, color: "#4a2808", letterSpacing: 1, marginBottom: 7 } }, T("Zał. 1642 · Najlepszy hazard w królestwie · Wchodzisz na własne ryzyko", "Est. 1642 · Finest gambling in the realm · Enter at own risk")),
            React.createElement("button", { onClick: toggleAmb, style: Object.assign({}, bS, { fontSize: 10, borderColor: ambOn ? "#c8a44a" : "#4a3210", color: ambOn ? "#f0c060" : "#7a6030" }) }, ambOn ? "🔇 " + T("Ucisz tłum", "Silence the crowd") : "🔊 " + T("Hałas tłumu", "Crowd Noise"))),
        React.createElement("div", { style: Object.assign({}, S.card, { border: "1px solid #5a3a1a" }) },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 } },
                React.createElement("div", { style: { fontSize: 24 } }, "🍺"),
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: "#c8a44a" } },
                        T("Kufel Piwa", "Mug of Beer"), " ",
                        React.createElement("span", { style: { fontSize: 10, color: "#7a6030" } }, "· 1🥟 za kufel")),
                    React.createElement("div", { style: { fontSize: 10, color: "#7a6030" } },
                        "+25⚡ ", T("staminy", "stamina"), " · +5% ", T("szczęścia w grach (10 min)", "luck in games (10 min)"))),
                React.createElement("div", { style: { textAlign: "center" } },
                    React.createElement("div", { style: { fontSize: 10, color: beerStock > 0 ? "#c8a44a" : "#5a3a1a", marginBottom: 3 } },
                        beerStock, "/", BEER_MAX, " ", T("kufli", "mugs")),
                    React.createElement("button", { onClick: onDrinkBeer, disabled: beerStock <= 0 || pierogi <= 0 || stamina >= 100, style: Object.assign({}, S.bigBtn, { fontSize: 11, padding: "6px 10px", opacity: (beerStock > 0 && pierogi > 0 && stamina < 100) ? 1 : 0.35, borderColor: "#c8a44a" }) }, "🥟→🍺"))),
            hasBeerBuff && React.createElement("div", { style: { fontSize: 10, color: "#f0c060", background: "#2a1a06", borderRadius: 4, padding: "4px 8px", textAlign: "center" } },
                "🍺 ", T("Podpity! Szczęście +5%", "Tipsy! Luck +5%"), " · ", beerBuffMins, " min"),
            beerStock <= 0 && React.createElement("div", { style: { fontSize: 9, color: "#6a5020", textAlign: "center" } }, T("Brak kufli — restock co 45 min", "No mugs — restocks every 45 min")),
            pierogi <= 0 && beerStock > 0 && React.createElement("div", { style: { fontSize: 9, color: "#6a5020", textAlign: "center" } }, T("Brak pierogów 🥟 — zdobywaj je z questów!", "No pierogi 🥟 — earn them from quests!"))),
        React.createElement("div", { style: S.card },
            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, marginBottom: 1 } },
                "🎃 " + T("Trzy Kubki", "Three Cups"), " ", React.createElement("span", { style: { fontSize: 10, color: "#7a6030", fontWeight: "normal" } }, "· " + T("Znajdź monetę · Wygraj 2.5×", "Find the coin · Win 2.5×"))),
            React.createElement("div", { style: { display: "flex", gap: 7, alignItems: "center", marginBottom: 7 } },
                React.createElement("button", { onClick: function () { adjBet(setCup, -10); }, style: betBtn }, "−"),
                React.createElement("span", { style: { fontSize: 14, color: "#f0c060", minWidth: 40, textAlign: "center" } }, cup.bet, "g"),
                React.createElement("button", { onClick: function () { adjBet(setCup, 10); }, style: betBtn }, "+")),
            cup.phase === "idle" ? (React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center" } }, [0, 1, 2].map(function (i) { return React.createElement("button", { key: i, onClick: function () { playCups(i); }, disabled: gold < cup.bet, style: { fontSize: 28, background: "none", border: "2px solid #3a2a10", borderRadius: 8, padding: "7px 11px", cursor: "pointer", transition: "border-color 0.2s" }, onMouseOver: function (e) { e.currentTarget.style.borderColor = "#c8a44a"; }, onMouseOut: function (e) { e.currentTarget.style.borderColor = "#3a2a10"; } }, "🫙"); }))) : (React.createElement("div", { style: { textAlign: "center" } },
                React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center", marginBottom: 7 } }, [0, 1, 2].map(function (i) { return React.createElement("div", { key: i, style: { fontSize: 28, border: "2px solid " + (i === cup.win ? "#44dd44" : i === cup.chosen ? "#dd4444" : "#3a2a10"), borderRadius: 8, padding: "7px 11px", background: i === cup.win ? "#0a200a" : i === cup.chosen && i !== cup.win ? "#200a0a" : "transparent" } }, i === cup.win ? "🪙" : "🥤"); })),
                React.createElement("div", { style: { fontWeight: "bold", color: cup.chosen === cup.win ? wC : lC, marginBottom: 5 } }, cup.chosen === cup.win ? "🏆 " + T("Znalazłeś! +", "Found it! +") + Math.floor(cup.bet * 1.5) + "g" : "💀 " + T("Zły kubek! −", "Wrong cup! −") + cup.bet + "g"),
                React.createElement("button", { onClick: function () { reset(setCup); }, style: bS }, T("Zagraj ponownie", "Play Again"))))),
        React.createElement("div", { style: S.card },
            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, marginBottom: 1 } },
                "🎲 " + T("Kostki", "Dice Roll"), " ", React.createElement("span", { style: { fontSize: 10, color: "#7a6030", fontWeight: "normal" } }, "· " + T("WYSOKO/NISKO 1.8× · SIEDEM 5×", "HIGH/LOW 1.8× · SEVEN 5×"))),
            React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 7, flexWrap: "wrap" } },
                React.createElement("button", { onClick: function () { adjBet(setDce, -10); }, style: betBtn }, "−"),
                React.createElement("span", { style: { fontSize: 14, color: "#f0c060", minWidth: 40, textAlign: "center" } }, dce.bet, "g"),
                React.createElement("button", { onClick: function () { adjBet(setDce, 10); }, style: betBtn }, "+"),
                ["high", "low", "seven"].map(function (pk) { return React.createElement("button", { key: pk, onClick: function () { setDce(function (p) { return Object.assign({}, p, { pick: pk }); }); }, style: Object.assign({}, bS, { borderColor: dce.pick === pk ? "#c8a44a" : "#4a3210", color: dce.pick === pk ? "#f0c060" : "#c8a44a", padding: "4px 7px" }) }, pk === "high" ? T("WYSOKO 8+", "HIGH 8+") : pk === "low" ? T("NISKO 6−", "LOW 6−") : T("SIEDEM", "SEVEN")); })),
            dce.phase === "idle" ? (React.createElement("button", { onClick: playDice, disabled: gold < dce.bet, style: Object.assign({}, S.bigBtn, { width: "100%", textAlign: "center", fontSize: 13, padding: "9px", opacity: gold >= dce.bet ? 1 : 0.4 }) }, "🎲 " + T("Rzuć!", "Roll!"))) : (React.createElement("div", { style: { textAlign: "center" } },
                React.createElement("div", { style: { fontSize: 30, margin: "4px 0" } }, DF[dce.r1], " ", DF[dce.r2]),
                React.createElement("div", { style: { fontSize: 11, color: "#9a7030", marginBottom: 3 } }, T("Suma: ", "Total: "), dce.r1 + dce.r2),
                (function () { var t = dce.r1 + dce.r2, win = (dce.pick === "high" && t > 7) || (dce.pick === "low" && t < 7) || (dce.pick === "seven" && t === 7), profit = win ? (dce.pick === "seven" ? dce.bet * 4 : Math.floor(dce.bet * 0.8)) : -dce.bet; return React.createElement("div", { style: { fontWeight: "bold", color: win ? wC : lC, marginBottom: 5 } }, win ? "🏆 " + dce.pick.toUpperCase() + "! +" + Math.abs(profit) + "g" : "💀 " + T("−", "−") + dce.bet + "g"); }()),
                React.createElement("button", { onClick: function () { reset(setDce); }, style: bS }, T("Rzuć ponownie", "Roll Again"))))),
        React.createElement("div", { style: S.card },
            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, marginBottom: 1 } },
                "🃏 " + T("Wyższa Karta", "High Card"), " ", React.createElement("span", { style: { fontSize: 10, color: "#7a6030", fontWeight: "normal" } }, "· " + T("Wygraj 1.9× · Remis zwrot", "Win 1.9× · Tie refunds"))),
            React.createElement("div", { style: { display: "flex", gap: 7, alignItems: "center", marginBottom: 7 } },
                React.createElement("button", { onClick: function () { adjBet(setCrd, -10); }, style: betBtn }, "−"),
                React.createElement("span", { style: { fontSize: 14, color: "#f0c060", minWidth: 40, textAlign: "center" } }, crd.bet, "g"),
                React.createElement("button", { onClick: function () { adjBet(setCrd, 10); }, style: betBtn }, "+")),
            crd.phase === "idle" ? (React.createElement("button", { onClick: playCard, disabled: gold < crd.bet, style: Object.assign({}, S.bigBtn, { width: "100%", textAlign: "center", fontSize: 13, padding: "9px", opacity: gold >= crd.bet ? 1 : 0.4 }) }, "🃏 " + T("Rozdaj!", "Draw!"))) : (React.createElement("div", { style: { textAlign: "center" } },
                React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 16, margin: "5px 0" } },
                    React.createElement("div", null,
                        React.createElement("div", { style: { fontSize: 10, color: "#7a6030", marginBottom: 2 } }, T("Ty", "You")),
                        React.createElement("div", { style: { fontSize: 26, background: "#1a1a2e", border: "2px solid #5a5aaa", borderRadius: 6, padding: "5px 10px", color: "#c8c8ff", minWidth: 34 } }, crd.h)),
                    React.createElement("div", { style: { display: "flex", alignItems: "center", fontSize: 12, color: "#7a6030" } }, "vs"),
                    React.createElement("div", null,
                        React.createElement("div", { style: { fontSize: 10, color: "#7a6030", marginBottom: 2 } }, T("Krupier", "Dealer")),
                        React.createElement("div", { style: { fontSize: 26, background: "#2e1a1a", border: "2px solid #aa5a5a", borderRadius: 6, padding: "5px 10px", color: "#ffc8c8", minWidth: 34 } }, crd.d))),
                (function () { var hi = CARDS.indexOf(crd.h), di = CARDS.indexOf(crd.d), profit = hi > di ? Math.floor(crd.bet * 0.9) : hi === di ? 0 : -crd.bet; return React.createElement("div", { style: { fontWeight: "bold", color: profit > 0 ? wC : profit === 0 ? "#c8a44a" : lC, marginBottom: 5, marginTop: 3 } }, profit > 0 ? "🏆 " + T("Wyższa karta! +", "Higher card! +") + profit + "g" : profit === 0 ? "🤝 " + T("Remis! Zakład zwrócony", "Tie! Bet returned") : "💀 " + T("Krupier wygrywa! −", "Dealer wins! −") + crd.bet + "g"); }()),
                React.createElement("button", { onClick: function () { reset(setCrd); }, style: bS }, T("Rozdaj ponownie", "Deal Again")))))));
}
