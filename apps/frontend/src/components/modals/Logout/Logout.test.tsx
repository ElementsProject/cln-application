import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import LogoutComponent from './Logout';
import { mockBKPRStoreData, mockCLNStoreData, mockRootStoreData, mockShowModals } from '../../../utilities/test-utilities/mockData';
import { RootService } from '../../../services/http.service';
import { spyOnUserLogout } from '../../../utilities/test-utilities/mockService';

describe('LogoutComponent', () => {
  const customMockStore = {
    root: {
      ...mockRootStoreData,
      showModals: {
        ...mockShowModals,
        logoutModal: true,
      }
    },
    cln: mockCLNStoreData,
    bkpr: mockBKPRStoreData
  };

  it('renders the logout modal', async () => {
    await renderWithProviders(<LogoutComponent />, { preloadedState: customMockStore });
    expect(screen.getByTestId('logout-modal')).toBeInTheDocument();
    expect(screen.getByText(/Logout\?/i)).toBeInTheDocument();
  });

  it('calls userLogout and clears stores on Yes click', async () => {
    spyOnUserLogout();
    await renderWithProviders(<LogoutComponent />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByText('Yes'));
    await waitFor(() => {
      expect(RootService.userLogout).toHaveBeenCalled();
    });
  });

  it('keeps the session view when the server does not end the session', async () => {
    jest.spyOn(RootService, 'userLogout').mockImplementation(async () => { throw 'Invalid CSRF token'; });
    const { getActions } = await renderWithProviders(<LogoutComponent />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByText('Yes'));
    await waitFor(() => {
      expect(getActions().map(a => a.type)).toContain('root/setShowToast');
    });
    expect(getActions().map(a => a.type)).not.toContain('root/clearRootStore');
    expect(getActions().find(a => a.type === 'root/setShowModals').payload.loginModal).toBe(false);
  });

  it('does not call userLogout on No click', async () => {
    spyOnUserLogout();
    await renderWithProviders(<LogoutComponent />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByText('No'));
    await waitFor(() => {
      expect(RootService.userLogout).not.toHaveBeenCalled();
    });
  });
});
