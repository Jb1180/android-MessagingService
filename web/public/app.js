'use strict';

// Messages page: incoming/outgoing filter.
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
if (filterButtons.length > 0) {
    const rows = Array.from(document.querySelectorAll('[data-direction]'));
    const count = document.querySelector('[data-count]');
    const empty = document.querySelector('[data-empty]');

    const applyFilter = (direction) => {
        let shown = 0;
        rows.forEach((row) => {
            const visible = direction === 'all' || row.dataset.direction === direction;
            row.hidden = !visible;
            if (visible) shown += 1;
        });
        filterButtons.forEach((button) => {
            const active = button.dataset.filter === direction;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        if (count) count.textContent = `${shown} message${shown === 1 ? '' : 's'}`;
        if (empty) empty.hidden = shown !== 0;
    };

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => applyFilter(button.dataset.filter));
    });
}

// Configuration page: save preferences and connection details.
const form = document.querySelector('[data-settings-form]');
if (form) {
    const status = form.querySelector('[data-status]');
    const submit = form.querySelector('button[type="submit"]');

    const setFieldErrors = (errors) => {
        form.querySelectorAll('[data-error-for]').forEach((node) => {
            const message = errors && errors[node.dataset.errorFor];
            node.textContent = message || '';
            node.hidden = !message;
        });
    };

    const setStatus = (message, state) => {
        if (!status) return;
        status.textContent = message;
        status.dataset.state = state;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        setFieldErrors(null);
        setStatus('Saving…', 'pending');
        if (submit) submit.disabled = true;

        const data = new FormData(form);
        const payload = {
            displayName: String(data.get('displayName') || ''),
            serviceHost: String(data.get('serviceHost') || ''),
            servicePort: Number(data.get('servicePort')),
            notificationsEnabled: data.get('notificationsEnabled') === 'on',
            notificationSound: data.get('notificationSound') === 'on',
            useTls: data.get('useTls') === 'on'
        };

        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const body = await response.json();

            if (!response.ok) {
                setFieldErrors(body.errors || {});
                setStatus((body.errors && Object.values(body.errors)[0]) || body.error || 'Could not save your settings.', 'error');
                return;
            }

            const saved = body.settings;
            const endpoint = form.querySelector('[data-endpoint]');
            const tls = form.querySelector('[data-tls]');
            if (endpoint) endpoint.textContent = `${saved.serviceHost}:${saved.servicePort}`;
            if (tls) tls.textContent = saved.useTls ? 'TLS on' : 'TLS off';
            setStatus('Settings saved.', 'ok');
        } catch (error) {
            setStatus('Could not reach the server. Try again.', 'error');
        } finally {
            if (submit) submit.disabled = false;
        }
    });
}
