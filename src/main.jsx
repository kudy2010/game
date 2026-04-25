import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import { storage } from './storage.js';

// Make storage available globally (for legacy window.storage references)
window.storage = storage;

try {
    var container = document.getElementById('root');
    var root = ReactDOM.createRoot(container);
    root.render(React.createElement(App));
} catch (e) {
    document.getElementById('root').innerHTML =
        '<div style="padding:20px;color:#c8a44a;font-family:Georgia,serif">' +
        '<div style="font-size:20px;margin-bottom:10px">⚠️ Błąd uruchomienia</div>' +
        '<pre style="color:#dd4444;font-size:11px;white-space:pre-wrap;background:#1a0808;padding:12px;border-radius:6px">' +
        (e.stack || e.message || String(e)).replace(/</g, '&lt;') +
        '</pre></div>';
}
