import { screen } from '@testing-library/react';
import CLNTransactionsList from './CLNTransactionsList';
import { renderWithMockCLNContext, getMockCLNStoreData, mockSelectedChannel, getMockRootStoreData } from '../../../utilities/test-utilities';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('CLNTransactionsList component ', () => {
  let providerRootProps;
  let providerCLNProps;

  beforeEach(() => {
    providerRootProps = JSON.parse(JSON.stringify(getMockRootStoreData()));
    providerCLNProps = JSON.parse(JSON.stringify(getMockCLNStoreData()));
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/cln',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    (useNavigate as jest.Mock).mockImplementation(() => jest.fn());
  });

  it('if it is loading show the spinner', () => {
    providerCLNProps.listLightningTransactions.isLoading = true;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNTransactionsList />);
    expect(screen.getByTestId('cln-transactions-list-spinner')).toBeInTheDocument();
  });

  it('if it is not loading dont show the spinner', () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNTransactionsList />);
    expect(screen.queryByTestId('cln-transactions-list-spinner')).not.toBeInTheDocument();
  })

  it('if it has an error, show the error view', () => {
    providerCLNProps.listLightningTransactions.clnTransactions = [];
    providerCLNProps.listLightningTransactions.error = "error message!";
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNTransactionsList />);
    expect(screen.getByTestId('cln-transactions-list-error')).toBeInTheDocument();
  })

  it('if it has transactions, show the offers list', () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNTransactionsList />);
    const offersList = screen.getByTestId('cln-transactions-list');
    expect(offersList).toBeInTheDocument();
    expect(offersList.children.length).toBe(4);
  })

  it('if there are no channels, show the text encouraging opening a channel', () => {
    providerCLNProps.listChannels.activeChannels = [];
    providerCLNProps.listLightningTransactions.clnTransactions = [];
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNTransactionsList />);
    expect(screen.getByText('No transaction found. Open channel to start!')).toBeInTheDocument();
  })

  it('if there are are active channels, show the text saying to use a channel', () => {
    providerCLNProps.listChannels.activeChannels = [mockSelectedChannel];
    providerCLNProps.listLightningTransactions.clnTransactions = [];
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNTransactionsList />);
    expect(screen.getByText('No transaction found. Click send/receive to start!')).toBeInTheDocument();
  })

});
