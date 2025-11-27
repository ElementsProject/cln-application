import '@testing-library/jest-dom';
import { spyOnBKPRGetAccountEvents, spyOnBKPRGetSatsFlow, spyOnBKPRGetVolume, spyOnGetInfo, spyOnListChannels, spyOnListFunds, spyOnListNodes, spyOnListPeers } from './utilities/test-utilities/mockService';

import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

window.prompt = jest.fn().mockImplementation(() => true);

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => children,
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  spyOnGetInfo();
  spyOnListNodes();
  spyOnListChannels();
  spyOnListPeers();
  spyOnListFunds();
  spyOnBKPRGetAccountEvents();
  spyOnBKPRGetSatsFlow();
  spyOnBKPRGetVolume();
  const originalConsoleWarning = console.warn;
  jest.spyOn(console, 'warn').mockImplementation((msg, ...args) => {
    if (
      typeof msg === 'string' &&
      (msg.includes('React Router Future Flag Warning') ||
       msg.includes('HydrateFallback') ||
       msg.includes('width') ||
       msg.includes('height') ||
       msg.includes('chart should be greater than 0'))
    ) {
      return;
    }
    originalConsoleWarning(msg, ...args);
  });
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

beforeAll(() => {
  window.scrollTo = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});
