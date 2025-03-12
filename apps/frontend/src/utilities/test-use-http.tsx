import { mockInvoiceRune, mockInvoice, mockOffer, mockRootStoreData } from '../utilities/test-utilities';

const useHttp = () => {
  const mockData = {
    setCSRFToken: jest.fn(() => new Promise((resolve) => setTimeout(() => resolve({ csrfToken: 'mockToken-oFIyo9pYNXp_1-1LooPUDdGA_K0' }), 1000))),
    getAuthStatus: jest.fn(() => Promise.resolve(mockRootStoreData.authStatus)),
    getAppConfigurations: jest.fn(() => Promise.resolve(mockRootStoreData.appConfig)),
    initiateDataLoading: jest.fn(),
    getConnectWallet: jest.fn(() => Promise.resolve(mockRootStoreData.walletConnect)),
    fetchData: jest.fn(),
    getFiatRate: jest.fn(() => Promise.resolve()),
    updateConfig: jest.fn(() => Promise.resolve()),
    openChannel: jest.fn(() => Promise.resolve()),
    closeChannel: jest.fn(() => Promise.resolve()),
    btcWithdraw: jest.fn(() => Promise.resolve()),
    btcDeposit: jest.fn(() => new Promise((resolve) => setTimeout(() => resolve({data: {bech32: 'mockaddress'}}), 1000))),
    clnSendPayment: jest.fn(() => Promise.resolve()),
    clnReceiveInvoice: jest.fn(() => Promise.resolve()),
    decodeInvoice: jest.fn((input) => Promise.resolve({data: (input.startsWith('lnb') ? mockInvoice : input.startsWith('lno') ? mockOffer : 'invalid')})),
    fetchInvoice: jest.fn(() => Promise.resolve()),
    createInvoiceRune: jest.fn(() => new Promise((resolve) => setTimeout(() => resolve(mockInvoiceRune), 1000))),
    userLogin: jest.fn(() => Promise.resolve()),
    resetUserPassword: jest.fn(() => Promise.resolve()),
    userLogout: jest.fn(() => Promise.resolve()),
  };

  return mockData;
};

export default useHttp;
