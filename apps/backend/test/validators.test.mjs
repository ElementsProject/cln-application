import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.APP_LOG_FILE = join(mkdtempSync(join(tmpdir(), 'cln-app-test-')), 'app.log');
const { validateCallRequest } = await import('../dist/controllers/lightning.js');
const { validateUiConfig, isInvoiceOnlyRune } = await import('../dist/controllers/shared.js');

test('call request: allow-listed methods pass, everything else is refused', () => {
  assert.equal(validateCallRequest('getinfo', {}), null);
  assert.equal(validateCallRequest('pay', { bolt11: 'lnbc1...' }), null);
  assert.match(validateCallRequest('stop', {}), /not permitted/);
  assert.match(validateCallRequest('showrunes', {}), /not permitted/);
  assert.match(validateCallRequest('dev-crash', {}), /not permitted/);
  assert.match(validateCallRequest(undefined, {}), /not permitted/);
  assert.match(validateCallRequest('getinfo', 'not-an-object'), /Invalid params/);
});

test('call request: createrune only with invoice restrictions', () => {
  assert.equal(validateCallRequest('createrune', { restrictions: [['method=invoice', 'method=listinvoices']] }), null);
  assert.match(validateCallRequest('createrune', { restrictions: [['method=pay']] }), /limited to invoice/);
  assert.match(validateCallRequest('createrune', { restrictions: [] }), /limited to invoice/);
  assert.match(validateCallRequest('createrune', {}), /limited to invoice/);
  assert.match(validateCallRequest('createrune', { restrictions: [['method=invoice', 'rate=1']] }), /limited to invoice/);
});

test('ui config: only known units, currencies and modes are accepted', () => {
  assert.equal(validateUiConfig({ unit: 'SATS', fiatUnit: 'USD', appMode: 'DARK' }), null);
  assert.match(validateUiConfig({ unit: 'BITS', fiatUnit: 'USD', appMode: 'DARK' }), /Invalid unit/);
  assert.match(validateUiConfig({ unit: 'SATS', fiatUnit: 'XXX', appMode: 'DARK' }), /Invalid fiatUnit/);
  assert.match(validateUiConfig({ unit: 'SATS', fiatUnit: 'USD', appMode: 'BLUE' }), /Invalid appMode/);
  assert.match(validateUiConfig(null), /required/);
  assert.match(validateUiConfig(['SATS']), /required/);
});

const alt = (value, condition = '=', fieldname = 'method') => ({ fieldname, value, condition, english: '' });
const rune = (restrictions, extra = {}) => ({ rune: 'x', unique_id: '1', restrictions_as_english: '', restrictions, ...extra });

test('invoice rune: only equality restrictions on invoice and listinvoices qualify', () => {
  assert.equal(isInvoiceOnlyRune(rune([{ alternatives: [alt('invoice'), alt('listinvoices')], english: '' }])), true);
  // Separate restrictions are ANDed: this rune can never authorize either method
  assert.equal(isInvoiceOnlyRune(rune([{ alternatives: [alt('invoice')], english: '' }, { alternatives: [alt('listinvoices')], english: '' }])), false);
  assert.equal(isInvoiceOnlyRune(rune([{ alternatives: [alt('invoice'), alt('listinvoices')], english: '' }, { alternatives: [alt('60', '<', 'rate')], english: '' }])), true);
  assert.equal(isInvoiceOnlyRune(rune([{ alternatives: [alt('invoice', '/')], english: '' }, { alternatives: [alt('listinvoices', '/')], english: '' }])), false);
  assert.equal(isInvoiceOnlyRune(rune([{ alternatives: [alt('invoice', '=', 'pnum'), alt('listinvoices', '=', 'pnum')], english: '' }])), false);
  assert.equal(isInvoiceOnlyRune(rune([{ alternatives: [alt('invoice')], english: '' }])), false);
  assert.equal(isInvoiceOnlyRune(rune([{ alternatives: [alt('invoice'), alt('listinvoices'), alt('pay')], english: '' }])), false);
  assert.equal(isInvoiceOnlyRune(rune([{ alternatives: [alt('invoice'), alt('listinvoices')], english: '' }], { blacklisted: true })), false);
  assert.equal(isInvoiceOnlyRune(rune([])), false);
});
