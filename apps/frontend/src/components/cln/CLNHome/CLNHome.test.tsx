import React from 'react';
import { screen } from '@testing-library/react';
import { getMockCLNStoreData, getMockRootStoreData, renderWithMockCLNContext } from '../../../utilities/test-utilities';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('CLNHome Component', () => {
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
    jest.useFakeTimers();
  });

  it('should render Loading when nodeInfo is loading', () => {
    providerRootProps.authStatus.isAuthenticate = true;
    providerCLNProps.nodeInfo.isLoading = true;
    renderWithMockCLNContext(providerRootProps, providerCLNProps);
    expect(screen.getByTestId('row-loading')).toBeInTheDocument();
  });

  it('should render error message when nodeInfo has an error', () => {
    const errorMessage = 'Error loading node info';
    providerRootProps.authStatus.isAuthenticate = true;
    providerCLNProps.nodeInfo = { isLoading: false, error: errorMessage };
    renderWithMockCLNContext(providerRootProps, providerCLNProps);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render Header and Outlet by default', () => {
    providerRootProps.authStatus.isAuthenticate = true;
    providerCLNProps.nodeInfo = { isLoading: false, error: null };

    renderWithMockCLNContext(providerRootProps, providerCLNProps);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('cln-container')).toBeInTheDocument();
  });

  it('should render Overview and Cards when on /cln route', () => {
    providerRootProps.authStatus.isAuthenticate = true;
    providerCLNProps.nodeInfo = { isLoading: false, error: null };
    renderWithMockCLNContext(providerRootProps, providerCLNProps);
    expect(screen.getByTestId('overview-total-balance-col')).toBeInTheDocument();
    expect(screen.getByTestId('btc-card')).toBeInTheDocument();
    expect(screen.getByTestId('cln-card')).toBeInTheDocument();
    expect(screen.getByTestId('channels-card')).toBeInTheDocument();
  });

  it('should not render Overview and Cards on other routes', () => {
    providerRootProps.authStatus.isAuthenticate = true;
    providerCLNProps.nodeInfo = { isLoading: false, error: null };
    renderWithMockCLNContext(providerRootProps, providerCLNProps, '/cln/bookkeeper');
    expect(screen.queryByTestId('btc-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cln-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('channels-card')).not.toBeInTheDocument();
  });
});
