import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import express from 'express';
import cookieParser from 'cookie-parser';

process.env.APP_LOG_FILE = join(mkdtempSync(join(tmpdir(), 'cln-app-test-')), 'app.log');
const { csrfProtection, generateCsrfToken } = await import('../dist/shared/csrf.js');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(csrfProtection);
app.get('/csrf', (req, res) => res.json({ csrfToken: generateCsrfToken(req, res) }));
app.post('/change', (req, res) => res.json({ changed: true }));
app.use((err, req, res, next) => res.status(err.status || 500).json(err.code || 'error'));

const server = app.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
after(() => server.close());

test('state-changing requests need a token that matches the signed cookie', async () => {
  const noToken = await fetch(`${base}/change`, { method: 'POST' });
  assert.equal(noToken.status, 403);
  assert.equal(await noToken.json(), 'EBADCSRFTOKEN');

  const issue = await fetch(`${base}/csrf`);
  const { csrfToken } = await issue.json();
  const cookie = issue.headers.get('set-cookie').split(';')[0];
  assert.match(issue.headers.get('set-cookie'), /HttpOnly/);
  assert.match(issue.headers.get('set-cookie'), /SameSite=Strict/);

  const headerOnly = await fetch(`${base}/change`, { method: 'POST', headers: { 'X-XSRF-TOKEN': csrfToken } });
  assert.equal(headerOnly.status, 403);

  const cookieOnly = await fetch(`${base}/change`, { method: 'POST', headers: { cookie } });
  assert.equal(cookieOnly.status, 403);

  const forged = await fetch(`${base}/change`, { method: 'POST', headers: { cookie, 'X-XSRF-TOKEN': csrfToken.slice(0, -1) + '0' } });
  assert.equal(forged.status, 403);

  const valid = await fetch(`${base}/change`, { method: 'POST', headers: { cookie, 'X-XSRF-TOKEN': csrfToken } });
  assert.equal(valid.status, 200);
  assert.deepEqual(await valid.json(), { changed: true });
});
