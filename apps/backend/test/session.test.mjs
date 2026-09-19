import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.APP_LOG_FILE = join(mkdtempSync(join(tmpdir(), 'cln-app-test-')), 'app.log');
const utils = await import('../dist/shared/utils.js');

test('passwords are stored as salted scrypt and legacy values upgrade', async () => {
  const stored = await utils.hashPassword('correct horse');
  assert.match(stored, /^scrypt\$16384\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
  assert.deepEqual(await utils.verifyStoredPassword(stored, 'correct horse'), { ok: true, needsUpgrade: false });
  assert.deepEqual(await utils.verifyStoredPassword(stored, 'wrong'), { ok: false, needsUpgrade: false });
  assert.deepEqual(await utils.verifyStoredPassword('legacy-plain', 'legacy-plain'), { ok: true, needsUpgrade: true });
  assert.deepEqual(await utils.verifyStoredPassword('', 'anything'), { ok: false, needsUpgrade: false });
  assert.deepEqual(await utils.verifyStoredPassword(undefined, 'anything'), { ok: false, needsUpgrade: false });
});

test('session tokens verify, revoke on logout and expire on password change', () => {
  const token = utils.createSessionToken();
  assert.equal(utils.isAuthenticated(token), true);
  assert.equal(utils.isAuthenticated(''), 'Token missing');
  assert.notEqual(utils.isAuthenticated(token.slice(0, -2) + 'xx'), true);

  utils.revokeSession(token);
  assert.equal(utils.isAuthenticated(token), 'Session revoked');

  const before = utils.createSessionToken();
  utils.revokeAllSessions();
  assert.equal(utils.isAuthenticated(before), 'Session expired after password change');
  assert.equal(utils.isAuthenticated(utils.createSessionToken()), true);
});

test('trust proxy setting parses the documented forms', () => {
  assert.equal(utils.parseTrustProxy(''), false);
  assert.equal(utils.parseTrustProxy('false'), false);
  assert.equal(utils.parseTrustProxy('true'), true);
  assert.equal(utils.parseTrustProxy('2'), 2);
  assert.equal(utils.parseTrustProxy('loopback, 10.0.0.0/8'), 'loopback, 10.0.0.0/8');
});
