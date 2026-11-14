import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
process.env.APP_LOG_FILE = join(mkdtempSync(join(tmpdir(), 'channel-test-')), 'app.log');
const { LightningController, validateCallRequest } = await import(
  '../dist/controllers/lightning.js'
);
const { APP_CONSTANTS, AppConnect } = await import('../dist/shared/consts.js');
const id = 'ab'.repeat(32);
const peer = '02' + 'cd'.repeat(32);
const channel = { channel_id: id, peer_id: peer, state: 'CHANNELD_NORMAL', peer_connected: true };
async function request(method, params, call, connection = AppConnect.REST) {
  APP_CONSTANTS.APP_CONNECT = connection;
  const controller = new LightningController({ call });
  const res = {
    statusCode: 200,
    status(value) {
      this.statusCode = value;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    },
  };
  await controller.callMethod({ body: { method, params } }, res, () => {});
  return res;
}
test('splice input accepts only a channel and positive whole-satoshi amount', () => {
  for (const method of ['splicein', 'spliceout']) {
    assert.equal(validateCallRequest(method, { channel: id, amount: '1000000' }), null);
    for (const amount of ['0', '-1', '1.5', '1sat', '9007199254740992'])
      assert.ok(validateCallRequest(method, { channel: id, amount }));
    assert.ok(validateCallRequest(method, { channel: id, amount: '1', force_feerate: true }));
    assert.ok(validateCallRequest(method, { channel: 'not a channel', amount: '1' }));
  }
  assert.equal(validateCallRequest('offer', {}), null);
  assert.equal(validateCallRequest('fetchinvoice', {}), null);
});
test('splice checks connection, pending funding and peer features before mutation', async () => {
  for (const changed of [{ peer_connected: false }, { state: 'ONCHAIN' }, { inflight: [{}] }]) {
    const calls = [];
    const res = await request('splicein', { channel: id, amount: '1' }, async method => {
      calls.push(method);
      return { channels: [{ ...channel, ...changed }] };
    });
    assert.notEqual(res.statusCode, 200);
    assert.deepEqual(calls, ['listpeerchannels']);
  }
  for (const features of ['00', 'invalid']) {
    const calls = [];
    const res = await request('spliceout', { channel: id, amount: '1' }, async method => {
      calls.push(method);
      return method === 'listpeerchannels' ? { channels: [channel] } : { peers: [{ features }] };
    });
    assert.notEqual(res.statusCode, 200);
    assert.deepEqual(calls, ['listpeerchannels', 'listpeers']);
  }
  const calls = [];
  const res = await request(
    'splicein',
    { channel: id, amount: '1000000' },
    async (method, params) => {
      calls.push([method, params]);
      return method === 'listpeerchannels'
        ? { channels: [channel] }
        : method === 'listpeers'
          ? { peers: [{ features: (1n << 63n).toString(16) }] }
          : { txid: id };
    },
  );
  assert.equal(res.statusCode, 200);
  assert.deepEqual(calls.at(-1), ['splicein', { channel: id, amount: '1000000' }]);
});
test('gRPC splice refusal happens before any node operation', async () => {
  const res = await request(
    'splicein',
    { channel: id, amount: '1' },
    () => {
      throw Error('must not call');
    },
    AppConnect.GRPC,
  );
  assert.match(res.body, /gRPC/);
});
test('labels are limited to the application namespace and existing channels', async () => {
  assert.ok(validateCallRequest('setchannellabel', { channel_id: id, label: 'x'.repeat(81) }));
  assert.ok(validateCallRequest('setchannellabel', { channel_id: id, label: 'bad\nlabel' }));
  const calls = [];
  const res = await request(
    'setchannellabel',
    { channel_id: id, label: ' Savings ' },
    async (method, params) => {
      calls.push([method, params]);
      return { channels: [channel] };
    },
  );
  assert.deepEqual(res.body, { channel_id: id, label: 'Savings' });
  assert.deepEqual(calls[1], [
    'datastore',
    {
      key: ['cln-application', 'channel-labels', id],
      string: 'Savings',
      mode: 'create-or-replace',
    },
  ]);
  const missing = await request(
    'setchannellabel',
    { channel_id: id, label: 'test' },
    async method => {
      assert.equal(method, 'listpeerchannels');
      return { channels: [] };
    },
  );
  assert.notEqual(missing.statusCode, 200);
});
test('label lookup failure retains channels and exposes the failure', async () => {
  const res = await request('listpeerchannels', {}, async method => {
    if (method === 'listdatastore') throw Error('permission denied');
    return { channels: [channel] };
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.channels[0].channel_id, id);
  assert.match(res.body.channels[0].channel_label_error, /permission denied/);
});

test('gRPC encodes JSON-RPC datastore modes as the protobuf enum', async () => {
  const { GRPCService } = await import('../dist/service/grpc.service.js');
  const service = Object.create(GRPCService.prototype);
  assert.equal(
    service.transformPayload('Datastore', {
      key: ['app'],
      string: 'label',
      mode: 'create-or-replace',
    }).mode,
    2,
  );
  assert.throws(
    () => service.transformPayload('Datastore', { mode: 'unknown' }),
    /Invalid datastore mode/,
  );
});
