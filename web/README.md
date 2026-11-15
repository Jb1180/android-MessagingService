Web UI (Messages & Configuration)
=================================

The Android sample in `Application/` has no web front end, so this directory
adds a small one: a dependency-free Node HTTP server that renders the message
log and a settings page for the messaging service connection.

Pages
-----

- `/messages` — incoming and outgoing messages with contact details and
  timestamps, filterable by direction. Data comes from `data/messages.js`,
  which mirrors the conversations `MessagingService` posts.
- `/settings` — preferences (display name, notifications, sound) and the
  service connection details (host, port, TLS). Saved to
  `$DATA_DIR/settings.json`, served over `GET`/`PUT /api/settings`.
- `/` serves the same Messages page (no redirect), so the root URL of the
  browser preview always renders a real page. Trailing slashes (`/messages/`)
  resolve to the same route, and `HEAD` requests are answered like `GET`
  without a body.

Running locally
---------------

    node web/server.js

Environment variables:

| Variable   | Default          | Purpose                                    |
|------------|------------------|--------------------------------------------|
| `PORT`     | `3000`           | HTTP port                                  |
| `HOST`     | `0.0.0.0`        | Bind address                               |
| `DATA_DIR` | `web/.data`      | Where saved settings are stored            |

No `npm install` is required — the server uses only Node's standard library.
`GET /api/messages` and `GET /api/settings` return the same data as JSON.
