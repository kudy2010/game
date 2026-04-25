import React from 'react';
import { ICONS, AN } from '../styles.js';

export function enemyIconKey(name) {
    return "enemy_" + name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
export function classIconKey(cls) { return "class_" + cls; }

export function getAnim(side, state) { var m = AN[side]; return (m && state && m[state]) || ""; }

export function PixelIcon({ name, size = 28, style = {}, fallback }) {
    var src = ICONS[name];
    if (!src) return React.createElement("span", { style: { fontSize: size * 0.85, lineHeight: 1, display:"inline-block" } }, fallback || name);
    var outline = "drop-shadow(1px 0 0 rgba(0,0,0,0.95)) drop-shadow(-1px 0 0 rgba(0,0,0,0.95)) drop-shadow(0 1px 0 rgba(0,0,0,0.95)) drop-shadow(0 -1px 0 rgba(0,0,0,0.95))";
    var glow = "drop-shadow(0 0 6px rgba(200,164,74,0.20))";
    return React.createElement("img", { src: src, alt: name, style: Object.assign({ width: size, height: size, imageRendering: "pixelated", verticalAlign: "middle", filter: outline + " " + glow }, style) });
}

export function CharSprite({ iconKey, emoji, size = 56, animState, side, style = {} }) {
    var src = ICONS[iconKey];
    var anim = animState ? getAnim(side || "hero", animState) : "";
    var dead = animState === "dead";
    var baseStyle = Object.assign({ display:"inline-block", animation: anim, filter: dead ? "grayscale(1) brightness(0.4)" : "" }, style);
    if (src) {
        var outline = "drop-shadow(1px 0 0 rgba(0,0,0,0.99)) drop-shadow(-1px 0 0 rgba(0,0,0,0.99)) drop-shadow(0 1px 0 rgba(0,0,0,0.99)) drop-shadow(0 -1px 0 rgba(0,0,0,0.99)) drop-shadow(0 0 8px rgba(200,164,74,0.18))";
        return React.createElement("img", { src: src, alt: iconKey, style: Object.assign({ width: size, height: size, imageRendering: "pixelated" }, baseStyle, { filter: (dead?"grayscale(1) brightness(0.4) ":"") + outline }) });
    }
    return React.createElement("span", { style: Object.assign({ fontSize: size * 0.78, lineHeight: 1 }, baseStyle) }, emoji);
}
