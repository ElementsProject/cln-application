import { isCompatibleVersion } from './data-formatters';

describe('isCompatibleVersion function', () => {
  it('should return true for compatible versions', async () => {
    expect(isCompatibleVersion('v23.05', '23.05')).toBe(true);
    expect(isCompatibleVersion('v23.08', '23.05')).toBe(true);
    expect(isCompatibleVersion('v24.02rc1', '23.05')).toBe(true);
    expect(isCompatibleVersion('v23.05rc1', '23.05')).toBe(true);
    expect(isCompatibleVersion('v23.05rc4-11-g1e96146', '23.05')).toBe(true);
    expect(isCompatibleVersion('v23.05-1-gf165dc0-modded', '23.05')).toBe(true);
    expect(isCompatibleVersion('v23.11-2', '23.05')).toBe(true);
  });

  it('should return false for incompatible versions', async () => {
    expect(isCompatibleVersion('v23.02', '23.05')).toBe(false);
    expect(isCompatibleVersion('v22.08', '23.05')).toBe(false);
    expect(isCompatibleVersion('v23.02rc1', '23.05')).toBe(false);
    expect(isCompatibleVersion('v23.05.1', '23.05')).toBe(false);
  });

  it('should handle empty or invalid input', async () => {
    expect(isCompatibleVersion('', '23.05')).toBe(false);
    expect(isCompatibleVersion('23.05', '')).toBe(false);
    expect(isCompatibleVersion('', '')).toBe(false);
    expect(isCompatibleVersion('invalidVersion', '23.05')).toBe(false);
    expect(isCompatibleVersion('23.05', 'invalidVersion')).toBe(false);
  });
});
