---
title: GlitchTip 7.0 released
description: Simpler Permissions, Better Stack Traces and QoL Improvements
published: true
---

GlitchTip 7.0 is out! It brings simpler permissions, much better stack traces, and a batch of quality of life improvements. Make sure to read [Breaking Changes](/blog/2026-11-09-glitchtip-7-0-release#breaking-changes) to understand how these changes affect you!

<h2 id="simpler-permissions">Simpler Permissions</h2>

In 7.0, we've reworked the old permissions scheme into one that is focused on roles. For both users and their API tokens, what you can do depends on your role in a given Organization. As a reminder, GlitchTip's roles from least to most access go as follows:

> Member < Admin < Manager < Owner

Please consult this table of changed behaviors to see how this might effect you. We suggest re-organizing users in your organization to fit this scheme.

| Action                                   | Before 7.0                                                | 7.0 and later |
| ---------------------------------------- | --------------------------------------------------------- | ------------- |
| Delete an organization                   | Manager or above                                          | **Owner**     |
| Rename a team                            | Any member                                                | **Admin+**    |
| Update a project                         | Any member                                                | **Admin+**    |
| Create a client key (DSN)                | Any member                                                | **Admin+**    |
| Hide an environment                      | Any member                                                | **Admin+**    |
| Create a project alert                   | Admin or above, or a member on one of the project's teams | **Admin+**    |
| Update or test a project alert           | Any member                                                | **Admin+**    |
| Create, edit or delete an uptime monitor | Any member                                                | **Admin+**    |
| Create a status page                     | Any member                                                | **Admin+**    |
| Grant, invite, change or remove an owner | Manager or above                                          | **Owner**     |

You cannot update any of the API tokens you've already created, so some new tokens will have to be minted to adapt to the updated behavior. Furthermore, some endpoints have had gates added to them, and API tokens will have to be created to access them:

- `org:read` to view uptime monitors and status pages
- `org:read` or `org:admin` for billing
- `event:read` for issues

## Better Stack Traces

Symbolication turns a minified, compiled or obfuscated stack trace back into real function names, files and line numbers, using the sourcemaps, debug files and ProGuard mappings you upload. We rebuilt it in 7.0.

- **Less memory.** GlitchTip used to re-read your uploads for every event, which caused memory spikes on busy installs. Now each upload is processed once into a cache that later events reuse. Nothing to configure.
- **Android stack traces are deobfuscated.** ProGuard mappings now work, including ones uploaded with `sentry-cli upload-proguard` 3.x, which used to be rejected while the CLI reported success. Frames also show their real line numbers.
- **Better native stack traces.** Windows crashes now match their uploaded PDBs and get source context from source bundles. Every architecture of a universal (fat) binary is used, so arm64 crashes symbolicate. Caller frames point at the line of the call, not the line after it.

## Alerts

- **Alerts by environment.** A project alert can now name the environments it applies to, so a flood of errors from staging no longer pings you about production. Leave it empty and the alert matches every environment, as before.
- **Slack alerts.** A new Slack alert recipient posts formatted messages to a Slack incoming webhook, for both issue and uptime alerts.

## AI Assistants

GlitchTip's built-in [MCP server](/documentation/mcp) lets AI assistants read your issues, events, performance data and logs. In 7.0 it returns a trimmed event by default to save on token usage. It always keeps the exception and the frames where the crash happened, and a new `get_event_detail` tool fetches anything left out.

## Other Improvements

- **Issue lookup by short ID.** Search for a short ID like BACKEND-1A in the issue list and go straight to that issue.
- **Sortable uptime monitors.** Sort your monitors by name, creation date, project or status.
- **Clearer dialogs and buttons.** Deleting something now always asks you to confirm, and buttons make it clearer what each choice does.
- **Faster first load.** A cold first load of the app drops from 126 KB to 31 KB.
- **Tunneled events accepted.** If you send events through a proxy, like the JavaScript SDK's tunnel option, GlitchTip now reads the DSN from the envelope instead of rejecting it with a 403.
- **Lighter ingest.** All event ingest now runs on our Rust pipeline, which uses less memory and CPU. The `GLITCHTIP_RUST_INGEST` variable is now ignored.
- **AWS RDS IAM.** Self-hosters can authenticate to AWS RDS with IAM tokens instead of a database password. Turn it on with `DATABASE_IAM_AUTH=true` and `sslmode=verify-full`.
- **Django 6.1.** Security support through December 2027.

<h2 id="breaking-changes">Breaking Changes</h2>

Hosted users only need to read [For All Users](/blog/2026-11-09-glitchtip-7-0-release#for-all-users). Self-hosting? Read both sections.

<h3 id="for-all-users">For All Users</h3>

- **All-digit org slugs renamed.** To improve compatibility with third-party API clients, every URL with an organization in it now also accepts the organization's numeric id, so slugs can no longer be all digits. Existing all-digit slugs got the first free "-N" appended: `2024` becomes `2024-1`, or `2024-2` if that one is taken. If your slug was all digits, update your links, bookmarks, CI configs and API scripts. Nothing redirects from the old slug.
- **Some tokens need reminting.** An API token with scopes beyond its owner's role stops working. Mint a new one.
- **Some actions now need admin.** Members lose a few configuration actions. See the table in [Simpler Permissions](/blog/2026-11-09-glitchtip-7-0-release#simpler-permissions).

### For Self-Hosted Users

As always, back up your database before upgrading.

- **On a release older than 6.0.9?** To keep your existing events, upgrade to the latest 6.x (6.2.6) and let it migrate before moving to 7.0.
- **PostgreSQL 15 or newer is required.** The easiest path is pg_dump and restore onto a new server. Upgrade Postgres while you are still on GlitchTip 6.x.
- **Renamed environment variables.** 7.0 no longer reads the old names in the [table below](/blog/2026-11-09-glitchtip-7-0-release#renamed-environment-variables) and uses the default instead. If you set a retention variable under its old name, rename it before upgrading, or retention falls back to 90 days and older events are **deleted**. GlitchTip 6.2.6 already reads the new names.
- **Check `TRUSTED_PROXIES`.** The default changed from `*` to `private`, so X-Forwarded-For is only read from proxies on private addresses. Behind Cloudflare, set `TRUSTED_PROXIES=cloudflare,private`. Behind another proxy with public addresses, list its ranges plus `private`. Until you do, users behind that proxy share one login rate limit, and GlitchTip logs a warning. `TRUSTED_PROXIES=*` restores the old behavior.
- **uWSGI removed.** The legacy uWSGI server is no longer installed in the Docker image. If you override GlitchTip's startup command, we recommend switching back to the default, `bin/start.sh`.
- **No more memory-based restarts.** GlitchTip no longer restarts workers when memory grows. Reported memory will look higher because those restarts were hiding the spikes. Size your containers for spikes. For periodic restarts, set `GRANIAN_WORKERS_LIFETIME`.
- **Removed settings.** `DATABASE_CONN_MAX_AGE`, `USE_ASYNC_SERVER`, `IS_WORKER`, `GLITCHTIP_EMBED_WORKER` and `SERVER_ROLE` no longer do anything and log a warning if set.

<h4 id="renamed-environment-variables">Renamed Environment Variables</h4>

| Retired name (now ignored)                    | Use instead                            |
| --------------------------------------------- | -------------------------------------- |
| `GLITCHTIP_MAX_EVENT_LIFE_DAYS`\*             | `GLITCHTIP_RETENTION_DAYS`             |
| `GLITCHTIP_MAX_TRANSACTION_EVENT_LIFE_DAYS`\* | `GLITCHTIP_TRANSACTION_RETENTION_DAYS` |
| `GLITCHTIP_MAX_UPTIME_CHECK_LIFE_DAYS`\*      | `GLITCHTIP_UPTIME_RETENTION_DAYS`      |
| `GLITCHTIP_MAX_FILE_LIFE_DAYS`\*              | `GLITCHTIP_FILE_RETENTION_DAYS`        |
| `GLITCHTIP_LOGS_COLD_DAYS`\*                  | `GLITCHTIP_LOG_RETENTION_DAYS`         |
| `GLITCHTIP_EVENTS_HOT_DAYS`                   | `GLITCHTIP_EVENT_HOT_DAYS`             |
| `GLITCHTIP_LOGS_HOT_DAYS`                     | `GLITCHTIP_LOG_HOT_DAYS`               |
| `ENABLE_OPEN_USER_REGISTRATION`\*\*           | `ENABLE_ORGANIZATION_CREATION`         |

`*` marks a retention setting. If you have the old name set, **update it.**

`**` controls organization creation and needs one extra step. If you set `ENABLE_OPEN_USER_REGISTRATION`, set `ENABLE_ORGANIZATION_CREATION` to the same value before upgrading and remove the old name. In 6.x the old name overrode the new one, so if you set both to different values, 7.0 will flip your organization-creation setting.

## What's Next

While this is the culmination of a lot of work, there's still plenty more on the horizon. Long term, we're working on finalizing an on-demand billing system. On the smaller side, you can look forward to Organization SSO Login and tweaks to uptime, issues and alert behavior, just to name a handful.

## Support Us

GlitchTip is 100% built and funded by users. No VC. We have no one to answer to but you.

### Support the project

- 🛡️ [Get Enterprise Support](mailto:support@glitchtip.com?subject=Purchasing%20enterprise%20support) (For Business) for $15 per user per month
- 💖 [Individual License](mailto:support@glitchtip.com?subject=Purchasing%20an%20individual%20license) (For Supporters) for $5 per month
- 💸 Donate via [Liberapay](https://en.liberapay.com/GlitchTip).

### Community & Social

- ⭐ on [GitLab](https://gitlab.com/glitchtip/glitchtip-backend/). Help us reach 400 stars!
- ⭐ on [Docker Hub](https://hub.docker.com/r/glitchtip/glitchtip), where we have over 5 million pulls
- ❤️ on [AlternativeTo](https://alternativeto.net/software/glitchtip/about/) and leave a review. AlternativeTo generates [significant](https://plausible.io/glitchtip.com?period=30d) website traffic.
- 🗣️ Talk to us on [Gitter](https://app.gitter.im/#/room/#GlitchTip_community:gitter.im)
