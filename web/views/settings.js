'use strict';

const { escapeHtml } = require('./format');

function renderToggle(name, title, hint, checked) {
    return `<label class="toggle">
  <input type="checkbox" name="${name}"${checked ? ' checked' : ''}>
  <span class="toggle__text">
    <span class="toggle__title">${escapeHtml(title)}</span>
    <span class="toggle__hint">${escapeHtml(hint)}</span>
  </span>
</label>`;
}

function renderSettings(settings) {
    return `<section class="page__head">
  <h1 class="page__title">Configuration</h1>
  <p class="page__lead">Update your preferences and the connection details used to reach the messaging service.</p>
</section>
<form class="settings" data-settings-form novalidate>
  <section class="card" aria-labelledby="preferences-title">
    <h2 class="card__title" id="preferences-title">Preferences</h2>
    <div class="field">
      <label class="field__label" for="displayName">Display name</label>
      <input class="input" id="displayName" name="displayName" type="text" maxlength="60" autocomplete="name" value="${escapeHtml(settings.displayName)}" required>
      <p class="field__hint">Shown on the conversations you reply to from this device.</p>
      <p class="field__error" data-error-for="displayName" role="alert" hidden></p>
    </div>
    <div class="toggles">
      ${renderToggle('notificationsEnabled', 'Show message notifications', 'Post a notification for each incoming conversation.', settings.notificationsEnabled)}
      ${renderToggle('notificationSound', 'Play a sound', 'Play the default notification sound with each alert.', settings.notificationSound)}
    </div>
  </section>
  <section class="card" aria-labelledby="connection-title">
    <h2 class="card__title" id="connection-title">Connection</h2>
    <p class="card__lead">Current endpoint: <strong data-endpoint>${escapeHtml(settings.serviceHost)}:${settings.servicePort}</strong> · <span data-tls>${settings.useTls ? 'TLS on' : 'TLS off'}</span></p>
    <div class="field">
      <label class="field__label" for="serviceHost">Service address</label>
      <input class="input" id="serviceHost" name="serviceHost" type="text" inputmode="url" spellcheck="false" autocapitalize="none" value="${escapeHtml(settings.serviceHost)}" required>
      <p class="field__hint">Host name or IP address of the messaging service, without a scheme.</p>
      <p class="field__error" data-error-for="serviceHost" role="alert" hidden></p>
    </div>
    <div class="field">
      <label class="field__label" for="servicePort">Port</label>
      <input class="input input--short" id="servicePort" name="servicePort" type="number" inputmode="numeric" min="1" max="65535" step="1" value="${settings.servicePort}" required>
      <p class="field__hint">Between 1 and 65535.</p>
      <p class="field__error" data-error-for="servicePort" role="alert" hidden></p>
    </div>
    ${renderToggle('useTls', 'Secure connection', 'Connect over TLS. Turn this off only for a local service.', settings.useTls)}
  </section>
  <div class="actions">
    <button class="button" type="submit">Save changes</button>
    <p class="status" role="status" data-status></p>
  </div>
</form>`;
}

module.exports = { renderSettings };
