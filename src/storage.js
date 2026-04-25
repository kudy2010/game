// localStorage polyfill — exposes window.storage used throughout the app
export var storage = {
    get: function(k) {
        return new Promise(function(res, rej) {
            var v = localStorage.getItem('ps_' + k);
            if (v === null) rej(new Error('not found')); else res({ key: k, value: v });
        });
    },
    set: function(k, v) {
        return new Promise(function(res, rej) {
            try { localStorage.setItem('ps_' + k, v); res({ key: k, value: v }); } catch(e) { rej(e); }
        });
    },
    delete: function(k) {
        return new Promise(function(res) {
            try { localStorage.removeItem('ps_' + k); } catch(e) {}
            res({ key: k, deleted: true });
        });
    },
    list: function(p) {
        return new Promise(function(res) {
            var keys = [];
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (k && k.startsWith('ps_')) {
                    var s = k.slice(3);
                    if (!p || s.startsWith(p)) keys.push(s);
                }
            }
            res({ keys: keys });
        });
    },
};

// Attach to window so existing code that references window.storage continues to work
window.storage = storage;
