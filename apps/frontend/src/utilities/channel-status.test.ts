import { nodeUris, pendingSplices } from './channel-status';

const id = '02' + 'a'.repeat(64);
test('only advertised listening endpoints become node URIs, including IPv6 and Tor', () => {
  expect(
    nodeUris(id, [
      { type: 'ipv4', address: '192.168.8.102', port: 9735 },
      { type: 'ipv6', address: '2001:db8::1', port: 9735 },
      { type: 'torv3', address: 'a'.repeat(56) + '.onion', port: 9735 },
      { type: 'ipv4', address: '127.0.0.1', port: 0 },
      { type: 'ipv4', address: '0.0.0.0', port: 9735 },
      { type: 'ipv6', address: '::', port: 9735 },
      { type: 'ipv4', address: '127.0.0.1', port: 9735 },
      { type: 'websocket', address: 'unknown', port: 9735 },
    ]),
  ).toEqual([
    id + '@192.168.8.102:9735',
    id + '@[2001:db8::1]:9735',
    id + '@' + 'a'.repeat(56) + '.onion:9735',
  ]);
  expect(nodeUris(id)).toEqual([]);
  expect(nodeUris('invalid', [{ type: 'ipv4', address: '127.0.0.1', port: 9735 }])).toEqual([]);
});
const channel = {
  state: 'CHANNELD_AWAITING_SPLICE',
  total_msat: 9999834000,
  inflight: [{ funding_txid: 'tx', total_funding_msat: 10999834000 }],
};
test('pending amount and confirmations come from node state without browser history', () => {
  expect(pendingSplices(channel, [['tx', 0]], 100)[0]).toEqual({
    txid: 'tx',
    delta: 1000000,
    capacity: 10999834,
    confirmations: 0,
  });
  expect(pendingSplices(channel, [['tx', 98]], 100)[0].confirmations).toBe(3);
  expect(pendingSplices(channel, null, null)[0].confirmations).toBeNull();
  expect(pendingSplices(channel, [], 100)[0].confirmations).toBeNull();
  expect(pendingSplices({ ...channel, state: 'CHANNELD_NORMAL' }, [['tx', 98]], 100)).toEqual([]);
  expect(pendingSplices({ ...channel, total_msat: 11999834000 }, [['tx', 98]], 100)[0].delta).toBe(
    -1000000,
  );
});

test('node connection URIs preserve advertised external port and never use a wildcard', () => {
  expect(nodeUris(id, [{ type: 'ipv4', address: '192.168.8.102', port: 64774 }])).toEqual([
    id + '@192.168.8.102:64774',
  ]);
  expect(nodeUris(id, [{ type: 'ipv4', address: '0.0.0.0', port: 9735 }])).toEqual([]);
});

test('invalid block heights never become fabricated confirmation counts', () => {
  expect(pendingSplices(channel, [['tx', 'unknown']], 100)[0].confirmations).toBeNull();
  expect(pendingSplices(channel, [['tx', -1]], 100)[0].confirmations).toBeNull();
});
