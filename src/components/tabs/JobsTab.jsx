import React, { useState, useEffect } from 'react';
import { JOBS, T } from '../../data.js';
import { S } from '../../styles.js';

export function JobsTab(props) {
    var hero = props.hero, activeJob = props.activeJob, onStartJob = props.onStartJob, onCancelJob = props.onCancelJob;
    var onClaimDaily = props.onClaimDaily, canClaimDaily = props.canClaimDaily;
    var _tick = useState(0);
    var setTick = _tick[1];
    useEffect(function () {
        if (!activeJob) return;
        var id = setInterval(function () { setTick(function (n) { return n + 1; }); }, 1000);
        return function () { clearInterval(id); };
    }, [activeJob]);
    var activeJobData = activeJob ? JOBS.find(function (j) { return j.id === activeJob.jobId; }) : null;
    var elapsed = activeJob ? Math.min(Date.now() - activeJob.startedAt, activeJobData ? activeJobData.duration : 0) : 0;
    var pct = activeJobData ? (elapsed / activeJobData.duration * 100) : 0;
    var remaining = activeJobData ? Math.max(0, activeJobData.duration - elapsed) : 0;
    var fmtTime = function (ms) { var s = Math.ceil(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60); return h > 0 ? h + "h " + (m % 60) + "m" : m > 0 ? m + "m " + ((s % 60) < 10 ? "0" : "") + (s % 60) + "s" : s + "s"; };
    var estGold = function (job) { return Math.floor((job.baseGold[0] + job.baseGold[1]) / 2) + Math.floor((hero ? hero.level : 1) * job.bonusPerLevel); };
    return (React.createElement("div", null,
        React.createElement("div", { style: Object.assign({}, S.card, { border: "1px solid " + (canClaimDaily ? "#c8a44a88" : "#2e1e08"), marginBottom: 10 }) },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                React.createElement("div", { style: { fontSize: 28 } }, "☀️"),
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, color: "#f0c060" } }, T("Dzienny Bonus", "Daily Bonus")),
                    React.createElement("div", { style: { fontSize: 10, color: "#7a6030" } }, T("Raz na 24h: +50g · +30⚡ · +1🥟", "Once per 24h: +50g · +30⚡ · +1🥟"))),
                React.createElement("button", { onClick: onClaimDaily, disabled: !canClaimDaily, style: Object.assign({}, S.bigBtn, { fontSize: 11, padding: "7px 12px", opacity: canClaimDaily ? 1 : 0.35, borderColor: canClaimDaily ? "#f0c060" : "#4a3210", color: canClaimDaily ? "#f0c060" : "#4a3210" }) }, canClaimDaily ? T("Odbierz!", "Claim!") : "✓ " + T("Odebrano", "Claimed")))),
        activeJob && activeJobData && (React.createElement("div", { style: Object.assign({}, S.card, { border: "1px solid #c8a44a66", marginBottom: 10 }) },
            React.createElement("div", { style: { fontSize: 11, color: "#7a6030", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 } },
                "💼 ", T("W trakcie pracy", "Working")),
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } },
                React.createElement("span", { style: { fontSize: 28 } }, activeJobData.emoji),
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("div", { style: { fontWeight: "bold", fontSize: 13 } }, T(activeJobData.name, activeJobData.nameEn)),
                    React.createElement("div", { style: { fontSize: 10, color: "#7a6030" } },
                        T("Pozostało:", "Remaining:"), " ", fmtTime(remaining)))),
            React.createElement("div", { style: { background: "#0a0604", borderRadius: 4, overflow: "hidden", height: 10, border: "1px solid #2e1e08", marginBottom: 8, position: "relative" } },
                React.createElement("div", { style: { width: pct + "%", height: "100%", background: "linear-gradient(90deg,#5a3808,#e0b040)", transition: "width 0.5s" } }),
                React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "rgba(230,200,90,0.9)", fontFamily: "Georgia,serif" } },
                    Math.floor(pct), "%")),
            pct >= 100 ? (React.createElement("div", { style: { textAlign: "center", color: "#44dd88", fontSize: 12, fontWeight: "bold" } }, T("✅ Praca zakończona! Nagroda zostanie odebrana automatycznie.", "✅ Job done! Reward will be collected automatically."))) : (React.createElement("button", { onClick: onCancelJob, style: { width: "100%", padding: "6px", background: "#1e1206", border: "1px solid #5a3a2a", color: "#9a5a3a", fontFamily: "Georgia,serif", cursor: "pointer", borderRadius: 4, fontSize: 11 } }, T("❌ Anuluj pracę (bez nagrody)", "❌ Cancel job (no reward)"))))),
        !activeJob && (React.createElement("div", null,
            React.createElement("div", { style: S.sec }, "💼 ", T("Dostępne Prace", "Available Jobs")),
            React.createElement("div", { style: { fontSize: 10, color: "#7a6030", marginBottom: 8, padding: "5px 9px", background: "#150e04", border: "1px solid #2e1e08", borderRadius: 6 } }, T("Wyślij bohatera do pracy. Podczas pracy nie możesz walczyć ani wchodzić do lochów. Nagroda odebrana automatycznie po powrocie.", "Send your hero to work. During work, combat and dungeons are unavailable. Reward is collected automatically.")),
            JOBS.map(function (job) {
                var canWork = hero && hero.level >= job.minLevel;
                var est = estGold(job);
                return (React.createElement("div", { key: job.id, style: Object.assign({}, S.card, { opacity: canWork ? 1 : 0.5 }) },
                    React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center" } },
                        React.createElement("div", { style: { fontSize: 26, width: 32, textAlign: "center" } }, job.emoji),
                        React.createElement("div", { style: { flex: 1 } },
                            React.createElement("div", { style: { fontWeight: "bold", fontSize: 13, marginBottom: 1 } }, T(job.name, job.nameEn)),
                            React.createElement("div", { style: { display: "flex", gap: 10, fontSize: 10, color: "#9a7030", flexWrap: "wrap" } },
                                React.createElement("span", null, "⏱ ", fmtTime(job.duration)),
                                React.createElement("span", null, "💰 ~", est, "g"),
                                React.createElement("span", { style: { color: "#9a8040" } }, "+", job.bonusPerLevel, "g/", T("lvl", "lvl"))),
                            !canWork && React.createElement("div", { style: { fontSize: 9, color: "#8a3a3a", marginTop: 2 } },
                                "🔒 ", T("Wymaga Poziomu", "Requires Level"), " ", job.minLevel)),
                        React.createElement("button", { onClick: function () { if (canWork) onStartJob(job); }, disabled: !canWork, style: Object.assign({}, S.bigBtn, { fontSize: 11, padding: "7px 10px", opacity: canWork ? 1 : 0.3 }) }, T("Wyślij", "Send")))));
            })))));
}
