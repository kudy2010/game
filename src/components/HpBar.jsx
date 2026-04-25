import React from 'react';

export function HpBar({ pct, height, showText, cur, max }) {
    var p = Math.max(0, Math.min(100, pct));
    var h = height || 11;
    var col = p > 55 ? "linear-gradient(90deg,#1a7a2a,#33dd55)" : p > 28 ? "linear-gradient(90deg,#7a7010,#ddc020)" : "linear-gradient(90deg,#7a1a1a,#dd2222)";
    return React.createElement("div", { style: { background: "#0a0604", borderRadius: 4, overflow: "hidden", height: h, border: "1px solid #2e1e08", position: "relative" } },
        React.createElement("div", { style: { width: p + "%", height: "100%", background: col, transition: "width 0.35s", position: "relative", overflow: "hidden", animation: p < 28 ? "hpWarn 1.1s ease-in-out infinite" : "" } }),
        React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: "35%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" } }),
        showText && React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "rgba(230,200,90,0.9)", fontFamily: "Georgia,serif", pointerEvents: "none", letterSpacing: 0.3 } }, cur, "/", max));
}
