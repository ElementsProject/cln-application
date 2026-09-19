import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'cln-app-test-'));
process.env.APP_LOG_FILE = join(dir, 'app.log');
process.env.APP_CONFIG_FILE = join(dir, 'config.json');
const { AuthController } = await import('../dist/controllers/auth.js');
const { hashPassword, createSessionToken } = await import('../dist/shared/utils.js');

const controller = new AuthController();

function fakeResponse() {
  const res = { statusCode: 200, body: undefined, cookies: {}, cleared: [] };
  res.status = code => { res.statusCode = code; return res; };
  res.json = body => { res.body = body; return res; };
  res.send = body => { res.body = body; return res; };
  res.cookie = (name, value) => { res.cookies[name] = value; return res; };
  res.clearCookie = name => { res.cleared.push(name); return res; };
  return res;
}

async function call(handler, { body = {}, cookies = {} } = {}) {
  const res = fakeResponse();
  await handler({ body, cookies, originalUrl: '/test' }, res, () => {});
  return res;
}

function writeConfig(password) {
  writeFileSync(process.env.APP_CONFIG_FILE, JSON.stringify({ unit: 'SATS', fiatUnit: 'USD', appMode: 'DARK', password }));
}

test('login accepts the right password only and issues a session cookie', async () => {
  writeConfig(await hashPassword('secret-one'));
  const bad = await call(controller.userLogin, { body: { password: 'nope' } });
  assert.equal(bad.statusCode, 401);
  assert.equal(bad.cookies.token, undefined);

  const missing = await call(controller.userLogin, { body: {} });
  assert.equal(missing.statusCode, 400);

  const good = await call(controller.userLogin, { body: { password: 'secret-one' } });
  assert.equal(good.statusCode, 201);
  assert.ok(good.cookies.token);
});

test('a legacy plaintext password is upgraded on first login', async () => {
  writeConfig('plain-legacy');
  const res = await call(controller.userLogin, { body: { password: 'plain-legacy' } });
  assert.equal(res.statusCode, 201);
  assert.match(JSON.parse(readFileSync(process.env.APP_CONFIG_FILE, 'utf8')).password, /^scrypt\$/);
});

test('reset needs a session and the current password once one is set', async () => {
  writeConfig(await hashPassword('secret-one'));
  const noSession = await call(controller.resetPassword, { body: { isValid: false, newPassword: 'attacker-choice' } });
  assert.equal(noSession.statusCode, 401);

  const session = createSessionToken();
  const wrongCurrent = await call(controller.resetPassword, {
    body: { currPassword: 'wrong', newPassword: 'secret-two' },
    cookies: { token: session },
  });
  assert.equal(wrongCurrent.statusCode, 401);

  const ok = await call(controller.resetPassword, {
    body: { currPassword: 'secret-one', newPassword: 'secret-two' },
    cookies: { token: session },
  });
  assert.equal(ok.statusCode, 201);
  assert.ok(ok.cookies.token);

  const stale = await call(controller.isUserAuthenticated, { body: { returnResponse: true }, cookies: { token: session } });
  assert.equal(stale.body.isAuthenticated, false);
  const fresh = await call(controller.isUserAuthenticated, { body: { returnResponse: true }, cookies: { token: ok.cookies.token } });
  assert.equal(fresh.body.isAuthenticated, true);
});

test('first-run reset sets a password when none exists', async () => {
  writeConfig('');
  const res = await call(controller.resetPassword, { body: { newPassword: 'first-password' } });
  assert.equal(res.statusCode, 201);
  assert.match(JSON.parse(readFileSync(process.env.APP_CONFIG_FILE, 'utf8')).password, /^scrypt\$/);
});

test('logout revokes the session it was called with', async () => {
  writeConfig(await hashPassword('secret-one'));
  const login = await call(controller.userLogin, { body: { password: 'secret-one' } });
  const token = login.cookies.token;
  const out = await call(controller.userLogout, { cookies: { token } });
  assert.equal(out.statusCode, 201);
  assert.deepEqual(out.cleared, ['token']);
  const after = await call(controller.isUserAuthenticated, { body: { returnResponse: true }, cookies: { token } });
  assert.equal(after.body.isAuthenticated, false);
});
