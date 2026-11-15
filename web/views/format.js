'use strict';

const timestampFormatter = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/London'
});

const HTML_ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => HTML_ESCAPES[character]);
}

function formatTimestamp(isoString) {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    return timestampFormatter.format(date);
}

function initials(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
}

module.exports = { escapeHtml, formatTimestamp, initials };
