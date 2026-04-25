var useState=React.useState,useEffect=React.useEffect,useRef=React.useRef;
// ── AUDIO MASTER ──────────────────────────────────────────────────────────────
var AM = (function () {
    var _c = null, _s = null, _m = null;
    function i() { if (_c)
        return; try {
        _c = new (window.AudioContext || window.webkitAudioContext)();
        _s = _c.createGain();
        _s.gain.value = 0.55;
        _s.connect(_c.destination);
        _m = _c.createGain();
        _m.gain.value = 0.5;
        _m.connect(_c.destination);
    }
    catch (e) { } }
    return { ctx: function () { i(); return _c; }, sfx: function () { i(); return _s; }, mus: function () { i(); return _m; }, resume: function () { i(); if (_c && _c.state === "suspended")
            _c.resume(); }, setMusVol: function (v) { i(); if (_m && _c)
            _m.gain.setTargetAtTime(v, _c.currentTime, 0.05); } };
})();
// ── SFX ───────────────────────────────────────────────────────────────────────
var SFX = (function () {
    function n(f, t, d, v, ef, del) { var c = AM.ctx(), o = AM.sfx(); if (!c || !o)
        return; var T = c.currentTime + (del || 0), osc = c.createOscillator(), g = c.createGain(); osc.connect(g); g.connect(o); osc.type = t || "square"; osc.frequency.setValueAtTime(f, T); if (ef)
        osc.frequency.exponentialRampToValueAtTime(ef, T + d); g.gain.setValueAtTime(Math.min(v || 0.18, 0.35), T); g.gain.exponentialRampToValueAtTime(0.0001, T + d); osc.start(T); osc.stop(T + d + 0.02); }
    function bmp(d, v, del) { var c = AM.ctx(), o = AM.sfx(); if (!c || !o)
        return; var T = c.currentTime + (del || 0), sr = c.sampleRate, buf = c.createBuffer(1, Math.ceil(sr * d), sr), da = buf.getChannelData(0); for (var i = 0; i < da.length; i++)
        da[i] = (Math.random() * 2 - 1) * (1 - i / da.length); var s = c.createBufferSource(), g = c.createGain(); s.buffer = buf; s.connect(g); g.connect(o); g.gain.setValueAtTime(v || 0.11, T); s.start(T); s.stop(T + d + 0.02); }
    return {
        attack: function () { n(280, "square", 0.07, 0.2, 130); bmp(0.07, 0.09); },
        hit: function () { n(140, "square", 0.1, 0.22, 75); bmp(0.1, 0.13); },
        crit: function () { n(540, "sawtooth", 0.05, 0.28, 170); n(270, "square", 0.15, 0.25, 90, 0.04); bmp(0.12, 0.18); },
        block: function () { n(920, "square", 0.04, 0.18, 700); n(460, "square", 0.1, 0.22, 380, 0.03); },
        dodge: function () { n(700, "square", 0.07, 0.13, 1050); },
        miss: function () { n(220, "square", 0.09, 0.07, 195); },
        buy: function () { n(660, "square", 0.07, 0.2); n(880, "square", 0.08, 0.2, 880, 0.09); },
        sell: function () { n(880, "square", 0.07, 0.2); n(550, "square", 0.08, 0.18, 550, 0.09); },
        heal: function () { n(440, "sine", 0.1, 0.2); n(550, "sine", 0.1, 0.2, 550, 0.11); n(660, "sine", 0.14, 0.22, 660, 0.22); },
        equip: function () { n(700, "square", 0.04, 0.18, 450); n(350, "square", 0.08, 0.15, 280, 0.04); bmp(0.05, 0.08, 0.03); },
        win: function () { [523, 659, 784, 1047].forEach(function (f, i) { n(f, "square", 0.13, 0.22, f, i * 0.1); }); },
        lose: function () { [360, 280, 215, 160].forEach(function (f, i) { n(f, "square", 0.18, 0.2, f, i * 0.15); }); },
        lvlUp: function () { [300, 400, 500, 640, 800, 1000].forEach(function (f, i) { n(f, "square", 0.12, 0.24, f, i * 0.09); }); },
        enter: function () { n(350, "square", 0.08, 0.2, 520); n(520, "square", 0.12, 0.22, 520, 0.1); },
        step: function () { n(160, "square", 0.04, 0.1); n(140, "square", 0.04, 0.09, 140, 0.22); },
        perk: function () { [500, 700, 900, 1100].forEach(function (f, i) { n(f, "sine", 0.1, 0.2, f, i * 0.08); }); },
        rareItem: function () { [800, 1000, 1300, 1600, 800].forEach(function (f, i) { n(f, "sine", 0.16, 0.28, f, i * 0.09); }); bmp(0.1, 0.14, 0.46); },
        coin: function () { n(1200, "sine", 0.07, 0.22, 900); n(880, "sine", 0.06, 0.18, 800, 0.08); },
        dice: function () { bmp(0.06, 0.18); n(280, "square", 0.04, 0.1, 240, 0.05); },
        cardFlip: function () { bmp(0.03, 0.14); n(600, "square", 0.03, 0.09, 500, 0.03); },
    };
})();
var TAVERN_AMB = (function () {
    var src = null, gn = null, active = false;
    function start() {
        if (active)
            return;
        var c = AM.ctx(), out = AM.mus();
        if (!c || !out)
            return;
        AM.resume();
        var sr = c.sampleRate, buf = c.createBuffer(1, sr * 4, sr), d = buf.getChannelData(0);
        var b = [0, 0, 0, 0, 0];
        for (var i = 0; i < d.length; i++) {
            var w = Math.random() * 2 - 1;
            b[0] = 0.99886 * b[0] + w * 0.0555;
            b[1] = 0.99332 * b[1] + w * 0.0751;
            b[2] = 0.969 * b[2] + w * 0.1539;
            b[3] = 0.8665 * b[3] + w * 0.3105;
            b[4] = 0.55 * b[4] + w * 0.533;
            d[i] = (b[0] + b[1] + b[2] + b[3] + b[4] + w * 0.5) * 0.09;
        }
        src = c.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        var bp = c.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 340;
        bp.Q.value = 0.7;
        gn = c.createGain();
        gn.gain.value = 0.13;
        src.connect(bp);
        bp.connect(gn);
        gn.connect(out);
        src.start();
        active = true;
    }
    function stop() {
        if (!active)
            return;
        var c = AM.ctx();
        if (c && gn)
            try {
                gn.gain.setTargetAtTime(0, c.currentTime, 0.3);
            }
            catch (e) { }
        setTimeout(function () { try {
            if (src)
                src.stop();
        }
        catch (e) { } src = null; gn = null; active = false; }, 450);
    }
    return { start: start, stop: stop, active: function () { return active; } };
})();
// ── MUSIC ─────────────────────────────────────────────────────────────────────
var MUSIC = (function () {
    var playing = false, si = 0, sched = null, tmr = null;
    var SONGS = [
        { name: "Tavern Night", bpm: 108, mel: [[69, 2], [72, 2], [76, 4], [74, 2], [72, 2], [69, 4], [67, 2], [69, 2], [72, 4], [69, 2], [67, 2], [64, 4], [69, 2], [72, 2], [74, 2], [76, 2], [79, 4], [74, 4], [72, 4], [69, 6], [0, 2], [69, 4]], bass: [[45, 8], [0, 8], [41, 8], [0, 8], [43, 8], [0, 8], [45, 8], [0, 8]], kick: [[1, 8], [0, 8]], snare: [[0, 4], [1, 4], [0, 4], [1, 4]], hat: [[1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2], [1, 2]] },
        { name: "March to Battle", bpm: 138, mel: [[72, 2], [74, 2], [76, 4], [77, 4], [76, 4], [74, 2], [72, 2], [71, 4], [69, 4], [0, 4], [72, 2], [72, 2], [74, 4], [76, 2], [77, 2], [79, 4], [77, 4], [76, 4], [74, 4], [72, 4]], bass: [[48, 4], [0, 4], [53, 4], [0, 4], [55, 4], [0, 4], [48, 4], [0, 4]], kick: [[1, 4], [0, 4], [1, 4], [0, 4]], snare: [[0, 4], [1, 4], [0, 4], [1, 4]], hat: [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1]] },
        { name: "Dungeon Depths", bpm: 88, mel: [[62, 4], [0, 4], [60, 4], [0, 4], [59, 4], [0, 4], [57, 4], [0, 4], [62, 6], [0, 2], [65, 6], [0, 2], [64, 8], [62, 8]], bass: [[50, 8], [0, 8], [46, 8], [0, 8], [48, 8], [0, 8], [45, 8], [0, 8]], kick: [[1, 8], [0, 8]], snare: [[0, 8], [1, 8]], hat: [[1, 4], [0, 4], [1, 4], [0, 4]] },
    ];
    function mf(m) { return m > 0 ? 440 * Math.pow(2, (m - 69) / 12) : 0; }
    function no(fr, ty, t, dur, v) { var c = AM.ctx(), o = AM.mus(); if (!c || !o || fr <= 0)
        return; var osc = c.createOscillator(), g = c.createGain(); osc.connect(g); g.connect(o); osc.type = ty; osc.frequency.value = fr; g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(v, t + 0.012); g.gain.setValueAtTime(v, t + Math.max(0.015, dur - 0.025)); g.gain.linearRampToValueAtTime(0.001, t + dur); osc.start(t); osc.stop(t + dur + 0.01); }
    function kick(t) { var c = AM.ctx(), o = AM.mus(); if (!c || !o)
        return; var osc = c.createOscillator(), g = c.createGain(); osc.connect(g); g.connect(o); osc.type = "sine"; osc.frequency.setValueAtTime(160, t); osc.frequency.exponentialRampToValueAtTime(35, t + 0.13); g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15); osc.start(t); osc.stop(t + 0.16); }
    function snare(t) { var c = AM.ctx(), o = AM.mus(); if (!c || !o)
        return; var dur = 0.11, sr = c.sampleRate, buf = c.createBuffer(1, Math.ceil(sr * dur), sr), d = buf.getChannelData(0); for (var i = 0; i < d.length; i++)
        d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); var s = c.createBufferSource(), g = c.createGain(); s.buffer = buf; s.connect(g); g.connect(o); g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur); s.start(t); s.stop(t + dur + 0.01); }
    function hat(t) { var c = AM.ctx(), o = AM.mus(); if (!c || !o)
        return; var dur = 0.032, sr = c.sampleRate, buf = c.createBuffer(1, Math.ceil(sr * dur), sr), d = buf.getChannelData(0); for (var i = 0; i < d.length; i++)
        d[i] = Math.random() * 2 - 1; var s = c.createBufferSource(), hp = c.createBiquadFilter(), g = c.createGain(); s.buffer = buf; hp.type = "highpass"; hp.frequency.value = 9000; s.connect(hp); hp.connect(g); g.connect(o); g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur); s.start(t); s.stop(t + dur + 0.005); }
    function pt(st, arr, bd, fn) { var c = AM.ctx(); if (!c)
        return; while (st.t < c.currentTime + 0.15) {
        var item = arr[st.idx % arr.length], dur = item[1] * bd;
        fn(item[0], st.t, dur);
        st.t += dur;
        st.idx++;
    } }
    function schedule() { if (!playing || !sched)
        return; var song = SONGS[si], bd = 60 / song.bpm / 4; pt(sched.mel, song.mel, bd, function (v, t, d) { no(mf(v), "square", t, d * 0.82, 0.09); }); pt(sched.bass, song.bass, bd, function (v, t, d) { no(mf(v), "triangle", t, d * 0.88, 0.11); }); pt(sched.kick, song.kick, bd, function (v, t) { if (v > 0)
        kick(t); }); pt(sched.snare, song.snare, bd, function (v, t) { if (v > 0)
        snare(t); }); pt(sched.hat, song.hat, bd, function (v, t) { if (v > 0)
        hat(t); }); }
    function rs() { var c = AM.ctx(); if (!c)
        return; var now = c.currentTime + 0.06; sched = { mel: { idx: 0, t: now }, bass: { idx: 0, t: now }, kick: { idx: 0, t: now }, snare: { idx: 0, t: now }, hat: { idx: 0, t: now } }; }
    return { SONGS: SONGS, start: function (idx) { AM.resume(); if (idx !== undefined)
            si = idx; playing = true; rs(); clearInterval(tmr); tmr = setInterval(schedule, 55); }, stop: function () { playing = false; clearInterval(tmr); }, next: function () { si = (si + 1) % SONGS.length; if (playing) {
            clearInterval(tmr);
            rs();
            tmr = setInterval(schedule, 55);
        } }, prev: function () { si = (si - 1 + SONGS.length) % SONGS.length; if (playing) {
            clearInterval(tmr);
            rs();
            tmr = setInterval(schedule, 55);
        } }, isPlaying: function () { return playing; }, si: function () { return si; } };
})();
