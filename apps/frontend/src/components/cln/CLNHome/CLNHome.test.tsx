import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { Loading } from '../../ui/Loading/Loading';
import { CLNContext } from '../../../store/CLNContext';
import CLNHome from './CLNHome';

jest.mock('../../ui/Header/Header', () => () => <div data-testid='mock-header' />);
jest.mock('../Overview/Overview', () => () => <div data-testid='mock-overview' />);
jest.mock('../BTCCard/BTCCard', () => () => <div data-testid='mock-btc-card' />);
jest.mock('../CLNCard/CLNCard', () => () => <div data-testid='mock-cln-card' />);
jest.mock('../ChannelsCard/ChannelsCard', () => () => <div data-testid='mock-channels-card' />);


const renderWithContext = (contextValue, initialRoute = '/cln') => {
  return render(
    <CLNContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path='/cln/*'
            element={
              <Suspense fallback={<Loading />}>
                <CLNHome />
              </Suspense>
            }
          />
        </Routes>
      </MemoryRouter>
    </CLNContext.Provider>
  );
};

describe('CLNHome Component', () => {
  it('should render Loading when nodeInfo is loading', () => {
    renderWithContext({ authStatus: { isAuthenticated: true }, nodeInfo: { isLoading: true } });
    expect(screen.getByTestId('row-loading')).toBeInTheDocument();
  });

  it('should render error message when nodeInfo has an error', () => {
    const errorMessage = 'Error loading node info';
    renderWithContext({ authStatus: { isAuthenticated: true }, nodeInfo: { isLoading: false, error: errorMessage } });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render Header and Outlet by default', () => {
    renderWithContext({ authStatus: { isAuthenticated: true }, nodeInfo: { isLoading: false, error: null } });
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('cln-container')).toBeInTheDocument();
  });

  it('should render Overview and Cards when on /cln route', () => {
    renderWithContext({ authStatus: { isAuthenticated: true }, nodeInfo: { isLoading: false, error: null } }, '/cln');
    expect(screen.getByTestId('mock-overview')).toBeInTheDocument();
    expect(screen.getByTestId('mock-btc-card')).toBeInTheDocument();
    expect(screen.getByTestId('mock-cln-card')).toBeInTheDocument();
    expect(screen.getByTestId('mock-channels-card')).toBeInTheDocument();
  });

  it('should not render Overview and Cards on other routes', () => {
    renderWithContext({ authStatus: { isAuthenticated: true }, nodeInfo: { isLoading: false, error: null } }, '/cln/some-other-page');
    expect(screen.queryByTestId('mock-overview')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-btc-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-cln-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-channels-card')).not.toBeInTheDocument();
  });
});
