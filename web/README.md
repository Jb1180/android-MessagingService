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
  without a body. Unknown paths return the styled 404 page.

Configuration schema
--------------------

`/settings` edits a single stored object, exposed at `/api/settings` and
persisted to `$DATA_DIR/settings.json` (written to a temporary file and renamed,
so a save is never half-written and survives a restart).

| Field                  | Type    | Default              | Rules                                                                                               |
|------------------------|---------|----------------------|-----------------------------------------------------------------------------------------------------|
| `displayName`          | string  | `"Sample user"`      | Required. Trimmed, 1–60 characters. Shown on the conversations you reply to from this device.         |
| `notificationsEnabled` | boolean | `true`               | Post a notification for each incoming conversation.                                                 |
| `notificationSound`    | boolean | `true`               | Play the default notification sound with each alert.                                                |
| `serviceHost`          | string  | `"msgsvc.example.com"` | Required. Host name or IP address only: letters, digits, dots and hyphens, starting and ending alphanumeric. No scheme, path, port or spaces. |
| `servicePort`          | integer | `8443`               | Required. 1–65535.                                                                                   |
| `useTls`               | boolean | `true`               | Connect to the messaging service over TLS.                                                          |

`displayName`, `serviceHost` and `servicePort` are validated on every save and
must be present in the request body. The three booleans are optional: leaving
one out keeps its stored value.

API
---

All responses are JSON (`application/json; charset=utf-8`).

### `GET /api/settings`

Returns the stored configuration.

    { "settings": { "displayName": "Sample user", "notificationsEnabled": true,
      "notificationSound": true, "serviceHost": "msgsvc.example.com",
      "servicePort": 8443, "useTls": true } }

### `PUT /api/settings`

Updates the preferences and connection details (`POST` is accepted as an alias).
The body is a JSON object using the fields from the schema above.

    curl -X PUT http://localhost:3000/api/settings \
      -H 'content-type: application/json' \
      -d '{"displayName":"Alex Mercer","notificationsEnabled":true,"notificationSound":false,
           "serviceHost":"msg.internal","servicePort":9443,"useTls":true}'

`200 OK` with the saved object, in the same shape as `GET`:

    { "settings": { ... } }

`400 Bad Request` when validation fails — nothing is written, and every failing
field is listed:

    { "errors": { "servicePort": "Enter a port between 1 and 65535." } }

Field messages: `displayName` — "Enter a display name." / "Keep the display name
under 60 characters."; `serviceHost` — "Enter the service address." / "Use a host
name or IP address, without a scheme or spaces."; `servicePort` — "Enter a port
between 1 and 65535."; a boolean sent as something other than `true`/`false` —
"Must be either on or off."

A body that is not valid JSON returns `400 { "error": "Request body must be valid JSON." }`.

### `GET /api/messages`

Returns the message log shown on `/messages`, newest first.

    { "messages": [ { "id": "msg-8", "direction": "outgoing",
      "contact": { "name": "Sam Whitfield", "address": "+44 7700 900233" },
      "body": "Everything green on staging, logging 3 messages per conversation.",
      "sentAt": "2026-11-15T18:05:00Z" } ] }

`direction` is `incoming` or `outgoing`; for an outgoing message `contact` is the
recipient. Messages are read-only sample data — there is no write endpoint.

### Errors

Unknown paths return the HTML 404 page; an unexpected server error returns
`500 { "error": "Something went wrong." }`.

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
