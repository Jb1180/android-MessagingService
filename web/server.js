'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const messages = require('./data/messages');
const createSettingsStore = require('./data/settings');
const { renderPage } = require('./views/layout');
const { renderMessages } = require('./views/messages');
const { renderSettings } = require('./views/settings');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '.data');

const settingsStore = createSettingsStore(DATA_DIR);

const PUBLIC_FILES = {
    '/styles.css': { file: path.join(__dirname, 'public', 'styles.css'), type: 'text/css; charset=utf-8' },
    '/app.js': { file: path.join(__dirname, 'public', 'app.js'), type: 'text/javascript; charset=utf-8' }
};

const BOOLEAN_FIELDS = ['notificationsEnabled', 'notificationSound', 'useTls'];

function send(res, status, body, contentType) {
    res.writeHead(status, { 'content-type': contentType, 'content-length': Buffer.byteLength(body) });
    res.end(body);
}

function sendHtml(res, status, html) {
    send(res, status, html, 'text/html; charset=utf-8');
}

function sendJson(res, status, data) {
    send(res, status, JSON.stringify(data), 'application/json; charset=utf-8');
}

function redirect(res, location) {
    res.writeHead(302, { location });
    res.end();
}

function readJson(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
            if (body.length > 64 * 1024) req.destroy();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body || '{}'));
            } catch (error) {
                reject(error);
            }
        });
        req.on('error', reject);
    });
}

/**
 * Validates a settings payload and returns the normalized settings plus any
 * field errors. Errors are keyed by form field name.
 */
function validateSettings(input, current) {
    const errors = {};
    const next = { ...current };

    const displayName = typeof input.displayName === 'string' ? input.displayName.trim() : '';
    if (!displayName) {
        errors.displayName = 'Enter a display name.';
    } else if (displayName.length > 60) {
        errors.displayName = 'Keep the display name under 60 characters.';
    } else {
        next.displayName = displayName;
    }

    const serviceHost = typeof input.serviceHost === 'string' ? input.serviceHost.trim() : '';
    if (!serviceHost) {
        errors.serviceHost = 'Enter the service address.';
    } else if (!/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/i.test(serviceHost)) {
        errors.serviceHost = 'Use a host name or IP address, without a scheme or spaces.';
    } else {
        next.serviceHost = serviceHost;
    }

    const servicePort = Number(input.servicePort);
    if (!Number.isInteger(servicePort) || servicePort < 1 || servicePort > 65535) {
        errors.servicePort = 'Enter a port between 1 and 65535.';
    } else {
        next.servicePort = servicePort;
    }

    for (const field of BOOLEAN_FIELDS) {
        if (typeof input[field] === 'boolean') {
            next[field] = input[field];
        } else if (input[field] !== undefined) {
            errors[field] = 'Must be either on or off.';
        }
    }

    return { next, errors };
}

async function handle(req, res) {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const route = url.pathname.replace(/\/+$/, '') || '/';
    const method = req.method || 'GET';

    if (method === 'GET' && route === '/') {
        return redirect(res, '/messages');
    }

    if (method === 'GET' && route === '/messages') {
        const html = renderPage({
            title: 'Messages',
            active: 'messages',
            body: renderMessages(messages)
        });
        return sendHtml(res, 200, html);
    }

    if (method === 'GET' && route === '/settings') {
        const html = renderPage({
            title: 'Configuration',
            active: 'settings',
            body: renderSettings(settingsStore.read())
        });
        return sendHtml(res, 200, html);
    }

    if (method === 'GET' && route === '/api/messages') {
        return sendJson(res, 200, { messages });
    }

    if (method === 'GET' && route === '/api/settings') {
        return sendJson(res, 200, { settings: settingsStore.read() });
    }

    if ((method === 'PUT' || method === 'POST') && route === '/api/settings') {
        let payload;
        try {
            payload = await readJson(req);
        } catch (error) {
            return sendJson(res, 400, { error: 'Request body must be valid JSON.' });
        }

        const { next, errors } = validateSettings(payload, settingsStore.read());
        if (Object.keys(errors).length > 0) {
            return sendJson(res, 400, { errors });
        }
        return sendJson(res, 200, { settings: settingsStore.write(next) });
    }

    const asset = PUBLIC_FILES[route];
    if (method === 'GET' && asset) {
        return fs.readFile(asset.file, (error, data) => {
            if (error) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
            send(res, 200, data, asset.type);
        });
    }

    const html = renderPage({
        title: 'Not found',
        active: '',
        body: '<section class="card"><h1 class="page__title">Page not found</h1>' +
            '<p class="page__lead">That address is not part of the Messaging Sample web UI. ' +
            'Try <a href="/messages">Messages</a> or <a href="/settings">Configuration</a>.</p></section>'
    });
    return sendHtml(res, 404, html);
}

const server = http.createServer((req, res) => {
    handle(req, res).catch((error) => {
        console.error('Request failed:', error);
        if (!res.headersSent) sendJson(res, 500, { error: 'Something went wrong.' });
        else res.end();
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Messaging Sample web UI listening on http://${HOST}:${PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => server.close(() => process.exit(0)));
}
