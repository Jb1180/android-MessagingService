Android MessagingService Sample
===============================

This sample has been deprecated/archived meaning it's read-only and it's no longer actively maintained (more details on archiving can be found [here][1]).

For a Notification sample, please check out the new [github.com/android/user-interface-samples][2] repo. Thank you!

[1]: https://help.github.com/en/articles/about-archiving-repositories
[2]: https://github.com/android/user-interface-samples

Web UI (Messages & Configuration)
=================================

The `web/` directory adds a small, dependency-free Node web UI (port 3000) on
top of the sample:

- `/messages` — incoming and outgoing messages with contact details, timestamps
  and a direction filter.
- `/settings` — preferences and the messaging service connection details
  (host, port, TLS), stored in `$DATA_DIR/settings.json`.
- `GET /api/settings` returns that configuration and `PUT /api/settings`
  updates it; `GET /api/messages` returns the message log.

Run it with `node web/server.js`. See [web/README.md](web/README.md) for the full
API reference and the configuration schema.
