import React from 'react';
import { render } from '@testing-library/react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthWrapper from './AuthWrapper';
import { mockRootStoreData } from '../../../utilities/test-utilities';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe('AuthWrapper', () => {
  let navigate;
  let rootCtx;

  beforeEach(() => {
    rootCtx = JSON.parse(JSON.stringify(mockRootStoreData));
    jest.spyOn(React, 'useContext').mockImplementation(() => rootCtx);
    navigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => navigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to / if the user is not authenticated', () => {
    rootCtx.authStatus = { isLoading: false, isAuthenticated: false, isValidPassword: true };
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/cln',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    render(<AuthWrapper>Test Children</AuthWrapper>);
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('should redirect to /gl if lightningNodeType is GREENLIGHT and path is /', () => {
    rootCtx.authStatus = { isLoading: false, isAuthenticated: true, isValidPassword: true };
    rootCtx.appConfig.serverConfig.lightningNodeType = 'GREENLIGHT';
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    render(<AuthWrapper>Test Children</AuthWrapper>);
    expect(navigate).toHaveBeenCalledWith('/gl');
  });

  it('should redirect to /cln if lightningNodeType is not GREENLIGHT and path is /', () => {
    rootCtx.authStatus = { isLoading: false, isAuthenticated: true, isValidPassword: true };
    rootCtx.appConfig.serverConfig.lightningNodeType = 'CLN';
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    render(<AuthWrapper>Test Children</AuthWrapper>);
    expect(navigate).toHaveBeenCalledWith('/cln');
  });
  
  it('should redirect to /gl if lightningNodeType is GREENLIGHT and path starts with /cln', () => {
    rootCtx.authStatus = { isLoading: false, isAuthenticated: true, isValidPassword: true };
    rootCtx.appConfig.serverConfig.lightningNodeType = 'GREENLIGHT';
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/cln/bookkeeper',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    render(<AuthWrapper>Test Children</AuthWrapper>);
    expect(navigate).toHaveBeenCalledWith('/gl');
  });

  it('should redirect to /cln if lightningNodeType is not GREENLIGHT and path starts with /gl', () => {
    rootCtx.authStatus = { isLoading: false, isAuthenticated: true, isValidPassword: true };
    rootCtx.appConfig.serverConfig.lightningNodeType = 'CLN';
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/gl/lsps',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    render(<AuthWrapper>Test Children</AuthWrapper>);
    expect(navigate).toHaveBeenCalledWith('/cln');
  });

  it('should render GLProvider if lightningNodeType is GREENLIGHT and path starts with /gl', () => {
    rootCtx.authStatus = { isLoading: false, isAuthenticated: true, isValidPassword: true };
    rootCtx.appConfig.serverConfig.lightningNodeType = 'GREENLIGHT';
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/gl/lsps',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    const { getByTestId } = render(<AuthWrapper>Test Children</AuthWrapper>);
    expect(getByTestId('gl-provider')).toBeInTheDocument();
  });

  it('should render CLNProvider if lightningNodeType is not GREENLIGHT and path starts with /cln', () => {
    rootCtx.authStatus = { isLoading: false, isAuthenticated: true, isValidPassword: true };
    rootCtx.appConfig.serverConfig.lightningNodeType = 'CLN';
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/cln/bookkeeper',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    const { getByTestId } = render(<AuthWrapper>Test Children</AuthWrapper>);
    expect(getByTestId('cln-provider')).toBeInTheDocument();
  });

});
