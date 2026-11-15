'use strict';

const fs = require('node:fs');
const path = require('node:path');

const DEFAULTS = {
    displayName: 'Sample user',
    notificationsEnabled: true,
    notificationSound: true,
    serviceHost: 'msgsvc.example.com',
    servicePort: 8443,
    useTls: true
};

/**
 * Stores the preferences and connection details as JSON in DATA_DIR, so they
 * survive a restart when the directory is mounted as a volume.
 */
module.exports = function createSettingsStore(dataDir) {
    const file = path.join(dataDir, 'settings.json');

    function read() {
        try {
            const stored = JSON.parse(fs.readFileSync(file, 'utf8'));
            return { ...DEFAULTS, ...stored };
        } catch (error) {
            return { ...DEFAULTS };
        }
    }

    function write(settings) {
        fs.mkdirSync(dataDir, { recursive: true });
        const temporary = `${file}.${process.pid}.tmp`;
        fs.writeFileSync(temporary, `${JSON.stringify(settings, null, 2)}\n`);
        fs.renameSync(temporary, file);
        return { ...settings };
    }

    return { read, write, defaults: { ...DEFAULTS } };
};

module.exports.DEFAULTS = DEFAULTS;
