RESTful API Adoption Checklist

This short checklist helps teams apply the RESTful API best practices and automate validation.

1) API design & contracts
- [ ] Keep resource URIs as nouns and consistent naming (plural) across the API.
- [ ] Use correct HTTP verbs for semantics (GET, POST, PUT, PATCH, DELETE).
- [ ] Provide an OpenAPI 3.0+ spec in the repository (root `openapi.yaml`).
- [ ] Document required/optional fields, formats (ISO 8601 UTC), and any enums.

2) Responses & errors
- [ ] Return appropriate HTTP status codes (201 with Location for creates, 204 for no-content, 4xx for client errors, 5xx for server errors).
- [ ] Standardize error shape (status, code, message, errors[], request_id).
- [ ] Include `X-Request-Id` or `request_id` in responses for tracing.

3) Pagination, filtering, sorting
- [ ] Design and document pagination strategy (cursor vs limit/offset).
- [ ] Provide `limit`, `cursor`, and `meta`/`links` in responses for paginated endpoints.
- [ ] Support `sort` and common filters; document available filter keys.

4) Caching & conditional requests
- [ ] Support `ETag` and `If-None-Match` where applicable; return 304 when unchanged.
- [ ] Set sensible `Cache-Control` headers for public resources; use `private` for user-specific data.

5) Security
- [ ] Use TLS everywhere in production.
- [ ] Implement appropriate auth (OAuth2/Bearer) and token lifetimes.
- [ ] Enforce authorization server-side; validate scopes/roles.

6) Idempotency & retries
- [ ] Support `Idempotency-Key` for critical non-idempotent endpoints (payments, orders).
- [ ] Return the original result for repeated idempotent requests with the same key.

7) Observability & monitoring
- [ ] Emit structured logs with request_id, user_id (when available), and latency.
- [ ] Record metrics: request count, success/error rate, p95/p99 latency.
- [ ] Add alerts for error spikes and latency regressions.

8) Contract testing & CI
- [ ] Add Spectral linting in CI to enforce OpenAPI style/security rules.
- [ ] Run contract tests (e.g., Dredd, Pact, or custom integration tests) in CI.
- [ ] Fail PRs if contract changes violate rules or tests fail.

9) Backwards compatibility & versioning
- [ ] Additive changes only for patch releases (avoid removing/renaming fields).
- [ ] Provide a migration guide and a versioned endpoint (e.g., `/v1/`) for breaking changes.

10) Docs & developer experience
- [ ] Publish OpenAPI-driven docs (ReDoc/Swagger) and keep the spec in source control.
- [ ] Provide example requests/responses and common usage patterns.

Quick local checks (commands)
- Lint OpenAPI spec with Spectral:
  npx @stoplight/spectral-cli lint "openapi.yaml"

- Run the Express API stub (project contains `api-stub`):
  cd api-stub
  npm install
  npm start

CI automation recommendations (already added):
- Run Spectral on every PR (see `.github/workflows/spectral.yml`).
- Add a separate job for contract tests that either spins up the service or runs tests against a test staging environment.

Contract test options
- Dredd (runs API tests against live service using the OpenAPI spec)
- Pact (consumer-driven contracts)
- Custom integration tests using test frameworks (Jest/Mocha) + `supertest`

Next steps
- Add a GitHub Actions workflow for contract tests (if you want, I can scaffold a Dredd or Jest-based contract job).
- Enhance the OpenAPI spec with more endpoints/examples and add Spectral rules tailored to your team.
- Generate SDKs from the OpenAPI spec for common client languages.

Edge cases to watch
- Pagination with high offsets (prefer cursor-based pagination).
- Concurrent updates — implement optimistic locking or return 409 on conflict.
- Partial failures in batch operations — decide on transactional vs per-item reporting.
