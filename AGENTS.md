# AI Agent Guidelines


## Version Control
- **Commits:** Use conventional commits (e.g., `fix:`, `feat:`, `refactor:`).

## Local Development

- **Backend:** sibling repo `glitchtip-backend`. Start with `docker compose up -d` from that repo; API is served on `http://localhost:8000`.
- **Frontend:** `npm start` in this repo; dev server at `http://localhost:4200` proxies API calls to the backend.
- **Test login:** the backend's first-run bootstrap prints a seeded admin user (email and password) in the `web` container logs — inspect with `docker compose logs web` in the backend repo to retrieve current credentials before logging in via the UI.
- **API token for seeding:** the bootstrap also seeds a full-scope API token on the test user (label `bootstrap_dev`). Query it with `docker compose exec web python manage.py shell -c "from apps.api_tokens.models import APIToken; print(APIToken.objects.first().token)"` and use `Authorization: Bearer <token>` against `http://localhost:8000/api/0/...` to create orgs/projects/events/transactions. Prefer this over driving sessions via curl or clicking through the UI when generating test data.

## Licensing — Clean Room Development

GlitchTip is API-compatible with Sentry, but **their server code and documentation are NOT open source**. They use the Business Source License (BSL) and Functional Source License (FSL). You MUST strictly adhere to a clean room development process.

- **OFF LIMITS (Server Code & Docs):** You are strictly prohibited from reading, searching, curling, copying, or referencing Sentry's server-side source code or official documentation. 
  - Do not access `getsentry/sentry`, `getsentry/self-hosted`, or similar server repositories.
  - Do not access `docs.sentry.io` or the `getsentry/sentry-docs` repository. 
- **ALLOWED (MIT SDKs):** You may read and analyze Sentry's **MIT-licensed client SDKs** (e.g., `sentry-python`, `sentry-javascript`). These send data *to* the server and are genuinely open source.
- **How to build for compatibility:** To understand API payloads or endpoints, do not look up their documentation. Instead, inspect the source code of the MIT-licensed SDKs to see what they transmit, or ask the user to provide a captured JSON payload from an SDK to use as a test fixture.
- **Terminology:** Avoid mentioning the company Sentry (capital S) unless explicitly necessary, to prevent trademark confusion. When referencing the client-side libraries, refer to them as "MIT sentry SDKs" (lowercase s).

