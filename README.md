API stub and OpenAPI starter

What I changed and created:

- `openapi.yaml` — OpenAPI 3.0 starter (already in repo)
- `docs/openapi.html` — ReDoc HTML that loads `/openapi.yaml`
- `api-stub/` — small Express server that serves the spec, docs, and implements basic endpoints
- `.spectral.yaml` — minimal Spectral configuration

Quick setup (PowerShell)

# from the project root (where package.json is under api-stub)
cd "api-stub"
# install dependencies
npm install
# lint the OpenAPI spec (requires internet to fetch Spectral package via npx)
npx @stoplight/spectral-cli lint "..\openapi.yaml"
# start the server
npm start

Access:
- API: http://localhost:3000/v1/users
- OpenAPI YAML: http://localhost:3000/openapi.yaml
- Docs (ReDoc): http://localhost:3000/docs/openapi.html

Notes:
- The server uses `express-openapi-validator` to validate requests against `openapi.yaml`.
- If you see validation errors from the validator, the server will return a structured error matching the spec.
- If you'd like I can further expand the OpenAPI file, add CI integration (Spectral in GitHub Actions), or generate server/client SDK stubs.
