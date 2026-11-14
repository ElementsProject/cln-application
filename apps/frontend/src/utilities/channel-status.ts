import { Address } from '../types/root.type';

export function nodeUris(id: string, addresses: Address[] = []): string[] {
  if (!/^(02|03)[0-9a-f]{64}$/i.test(id)) return [];
  return [
    ...new Set(
      addresses
        .filter(
          a =>
            ['ipv4', 'ipv6', 'torv3', 'dns'].includes(a.type || '') &&
            typeof a.address === 'string' &&
            !['0.0.0.0', '::', '[::]', '::1', '[::1]', 'localhost'].includes(
              a.address.toLowerCase(),
            ) &&
            !a.address.startsWith('127.') &&
            /^[a-z0-9.:[\]-]+$/i.test(a.address) &&
            Number.isInteger(a.port) &&
            a.port! > 0 &&
            a.port! <= 65535,
        )
        .map(a => {
          const host =
            a.address!.includes(':') && !a.address!.startsWith('[')
              ? '[' + a.address + ']'
              : a.address;
          return id + '@' + host + ':' + a.port;
        }),
    ),
  ];
}

export function pendingSplices(channel: any, rows: any[][] | null, tip: number | null) {
  if (channel.state !== 'CHANNELD_AWAITING_SPLICE') return [];
  return (channel.inflight || []).map((f: any) => {
    const row = rows?.find(row => row[0] === f.funding_txid);
    const height = row ? Number(row[1]) : null;
    const confirmations =
      height !== null &&
      Number.isInteger(height) &&
      height >= 0 &&
      tip !== null &&
      Number.isInteger(tip) &&
      tip >= 0
        ? height > 0
          ? Math.max(0, tip - height + 1)
          : 0
        : null;
    const capacity = Number(f.total_funding_msat) / 1000;
    return {
      txid: f.funding_txid,
      delta: capacity - Number(channel.total_msat) / 1000,
      capacity,
      confirmations,
    };
  });
}

// Balances are sats, while ProgressBar expects a percentage. Normalize before
// rendering so large channels and one-sided balances use the same scale.
export const localLiquidityPercent = (local: number, remote: number): number => {
  const safeLocal = Number.isFinite(local) ? Math.max(0, local) : 0;
  const safeRemote = Number.isFinite(remote) ? Math.max(0, remote) : 0;
  const total = safeLocal + safeRemote;
  return total > 0 ? (safeLocal / total) * 100 : 0;
};
