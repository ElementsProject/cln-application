import SHA256 from 'crypto-js/sha256';
import { BookkeeperService, CLNService, RootService } from '../../services/http.service';
import { mockAccountEventsData, mockAuthStatus, mockDecodedInvoice, mockFetchInvoice, mockInvoiceRune, mockListChannels, mockListFunds, mockListPeers, mockNewAddr, mockNodeInfo, mockSatsFlowData, mockSendPayment, mockSQLResponse, mockVolumeData } from '../../utilities/test-utilities/mockData';

export const spyOnUserLogin = () => (
  jest.spyOn(RootService, 'userLogin').mockImplementation(async (password) => {
  return {
    ...mockAuthStatus,
    isValidPassword: password === SHA256('correctpassword').toString()
  };
}));

export const spyOnUserLogout = () => (
  jest.spyOn(RootService, 'userLogout').mockImplementation(async () => {})
);

export const spyOnGetInfo = () => (
  jest.spyOn(RootService, 'getNodeInfo').mockImplementation(async () => mockNodeInfo)
);

export const spyOnListNodes = () => (
  jest.spyOn(RootService, 'listNodes').mockImplementation(async () => {})
);

export const spyOnListChannels = () => (
  jest.spyOn(RootService, 'listChannels').mockImplementation(async () => mockListChannels)
);

export const spyOnListPeers = () => (
  jest.spyOn(RootService, 'listPeers').mockImplementation(async () => mockListPeers)
);

export const spyOnListFunds = () => (
  jest.spyOn(RootService, 'listFunds').mockImplementation(async () => mockListFunds)
);

export const spyOnExecuteSql = () => (
  jest.spyOn(RootService, 'executeSql').mockImplementation(async () => mockSQLResponse)
)

export const spyOnCreateInvoiceRune = (errorMsg?: string) => {
  return jest.spyOn(CLNService, 'createInvoiceRune').mockImplementation(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => (errorMsg) ? reject(new Error(errorMsg)) : resolve(mockInvoiceRune), 4);
    });
  });
};

export const spyOnBTCDeposit = () => (
  jest.spyOn(CLNService, 'btcDeposit').mockImplementation(async () => mockNewAddr)
);

export const spyOnCLNSendPayment = () => (
  jest.spyOn(CLNService, 'clnSendPayment').mockImplementation(async () => mockSendPayment)
);

export const spyOnDecode = () => (
  jest.spyOn(CLNService, 'decodeInvoice').mockImplementation(async () => mockDecodedInvoice)
);

export const spyOnCLNFetchInvoice = () => (
  jest.spyOn(CLNService, 'fetchInvoice').mockImplementation(async () => mockFetchInvoice)
);

export const spyOnBKPRGetAccountEvents = () => (
  jest.spyOn(BookkeeperService, 'getAccountEvents').mockImplementation(async () => mockAccountEventsData)
);

export const spyOnBKPRGetSatsFlow = () => (
  jest.spyOn(BookkeeperService, 'getSatsFlow').mockImplementation(async () => mockSatsFlowData)
);

export const spyOnBKPRGetVolume = () => (
  jest.spyOn(BookkeeperService, 'getVolume').mockImplementation(async () => mockVolumeData)
);
