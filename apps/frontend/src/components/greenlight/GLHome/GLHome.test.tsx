import React from 'react';
import { screen } from '@testing-library/react';
import { getMockRootStoreData, getMockGLStoreData, renderWithMockGLContext } from '../../../utilities/test-utilities';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('GLHome Component', () => {
  let providerRootProps;
  let providerGLProps;

  beforeEach(() => {
    providerRootProps = JSON.parse(JSON.stringify(getMockRootStoreData()));
    providerGLProps = JSON.parse(JSON.stringify(getMockGLStoreData()));
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/gl',
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
    providerGLProps.nodeInfo.isLoading = true;
    renderWithMockGLContext(providerRootProps, providerGLProps);
    expect(screen.getByTestId('row-loading')).toBeInTheDocument();
  });

  it('should render error message when nodeInfo has an error', () => {
    const errorMessage = 'Error loading node info';
    providerRootProps.authStatus.isAuthenticate = true;
    providerGLProps.nodeInfo = { isLoading: false, error: errorMessage };
    renderWithMockGLContext(providerRootProps, providerGLProps);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render Header and Outlet by default', () => {
    providerRootProps.authStatus.isAuthenticate = true;
    providerGLProps.nodeInfo = { isLoading: false, error: null };
    renderWithMockGLContext(providerRootProps, providerGLProps);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('gl-container')).toBeInTheDocument();
  });

  it('should render Overview and Cards when on /gl route', () => {
    providerRootProps.authStatus.isAuthenticate = true;
    providerGLProps.nodeInfo = { isLoading: false, error: null };
    renderWithMockGLContext(providerRootProps, providerGLProps);
    expect(screen.getByTestId('gl-container')).toBeInTheDocument();
    expect(screen.getAllByTestId('capacity-card')).toHaveLength(2);    
    expect(screen.queryByTestId('payments-list')).toBeInTheDocument();
  });

  it('should not render Overview and Cards on other routes', () => {
    providerRootProps.authStatus.isAuthenticate = true;
    providerGLProps.nodeInfo = { isLoading: false, error: null };
    renderWithMockGLContext(providerRootProps, providerGLProps, '/gl/lsps');
    expect(screen.queryByTestId('capacity-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('payments-list')).not.toBeInTheDocument();
  });
});
