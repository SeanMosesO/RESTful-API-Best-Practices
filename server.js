const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const OpenApiValidator = require('express-openapi-validator');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve the OpenAPI file and docs
app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'openapi.yaml'));
});
app.use('/docs', express.static(path.join(__dirname, '..', 'docs')));

// Simple in-memory store for users
const users = new Map();
let nextId = 1;

// Install OpenAPI request validator using the root openapi.yaml
new OpenApiValidator({
  apiSpec: path.join(__dirname, '..', 'openapi.yaml'),
  validateRequests: true, // (body, query, params)
  validateResponses: false,
}).install(app)
  .then(() => {
    // GET /v1/users
    app.get('/v1/users', (req, res) => {
      const items = [...users.values()];
      res.json({ items, meta: { limit: items.length, next: null, prev: null } });
    });

    // POST /v1/users
    app.post('/v1/users', (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ status: 400, code: 'validation_error', message: 'Missing email or password', errors: [], request_id: 'local' });
      }
      const id = String(nextId++);
      const user = { id, email, name: '', created_at: new Date().toISOString() };
      users.set(id, user);
      res.location(`/v1/users/${id}`).status(201).json(user);
    });

    // GET /v1/users/:userId
    app.get('/v1/users/:userId', (req, res) => {
      const u = users.get(req.params.userId);
      if (!u) return res.status(404).json({ status: 404, code: 'not_found', message: 'User not found', request_id: 'local' });
      res.set('ETag', '"' + Buffer.from(u.id + u.created_at).toString('base64') + '"');
      res.json(u);
    });

    // Error handler for validation errors (from express-openapi-validator)
    app.use((err, req, res, next) => {
      // format errors from validator
      if (err && err.status && err.errors) {
        return res.status(err.status).json({ status: err.status, code: 'validation_error', message: err.message, errors: err.errors, request_id: 'local' });
      }
      // default handler
      next(err);
    });

    app.listen(PORT, () => {
      console.log(`API stub listening on http://localhost:${PORT}`);
    });
  })
  .catch(e => {
    console.error('Failed to start OpenAPI validator', e);
    process.exit(1);
  });
