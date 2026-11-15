'use strict';

const { escapeHtml, formatTimestamp, initials } = require('./format');

const FILTERS = [
    { value: 'all', label: 'All' },
    { value: 'incoming', label: 'Incoming' },
    { value: 'outgoing', label: 'Outgoing' }
];

function renderMessage(message) {
    const incoming = message.direction === 'incoming';
    const label = incoming ? 'From' : 'To';
    return `<li class="message message--${incoming ? 'incoming' : 'outgoing'}" data-direction="${message.direction}">
  <span class="avatar avatar--${incoming ? 'incoming' : 'outgoing'}" aria-hidden="true">${escapeHtml(initials(message.contact.name))}</span>
  <div class="message__main">
    <div class="message__head">
      <p class="message__who">
        <span class="message__relation">${label}</span>
        <span class="message__name">${escapeHtml(message.contact.name)}</span>
        <span class="message__addr">${escapeHtml(message.contact.address)}</span>
      </p>
      <time class="message__time" datetime="${escapeHtml(message.sentAt)}">${escapeHtml(formatTimestamp(message.sentAt))}</time>
    </div>
    <p class="message__text">${escapeHtml(message.body)}</p>
    <span class="badge badge--${incoming ? 'incoming' : 'outgoing'}">${incoming ? 'Incoming' : 'Outgoing'}</span>
  </div>
</li>`;
}

function renderMessages(messages) {
    const incoming = messages.filter((message) => message.direction === 'incoming').length;
    const outgoing = messages.length - incoming;

    return `<section class="page__head">
  <h1 class="page__title">Messages</h1>
  <p class="page__lead">Incoming and outgoing messages logged by the MessagingService, newest first.</p>
  <ul class="summary">
    <li class="summary__item"><strong>${messages.length}</strong> total</li>
    <li class="summary__item"><strong>${incoming}</strong> incoming</li>
    <li class="summary__item"><strong>${outgoing}</strong> outgoing</li>
  </ul>
</section>
<section class="card">
  <div class="toolbar">
    <div class="chips" role="group" aria-label="Filter messages">
      ${FILTERS.map((filter, index) => `<button type="button" class="chip${index === 0 ? ' is-active' : ''}" data-filter="${filter.value}" aria-pressed="${index === 0}">${filter.label}</button>`).join('\n      ')}
    </div>
    <p class="toolbar__count" data-count>${messages.length} messages</p>
  </div>
  <ul class="messages">
${messages.map((message) => renderMessage(message)).join('\n')}
  </ul>
  <p class="empty" data-empty hidden>No messages match this filter.</p>
</section>`;
}

module.exports = { renderMessages };
