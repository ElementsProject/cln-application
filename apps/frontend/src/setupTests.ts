import '@testing-library/jest-dom';
import { spyOnBKPRGetAccountEvents, spyOnBKPRGetSatsFlow, spyOnBKPRGetVolume, spyOnGetInfo, spyOnListChannels, spyOnListFunds, spyOnListNodes, spyOnListPeers } from './utilities/test-utilities/mockService';

let mockedLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
};

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
    useLocation: () => mockedLocation,
  };
});

export const setMockedLocation = (location: Partial<Location>) => {
  mockedLocation = { ...mockedLocation, ...location };
};

beforeEach(() => {
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
      msg.includes('React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7')
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
