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

  it('does not call userLogout on No click', async () => {
    spyOnUserLogout();
    await renderWithProviders(<LogoutComponent />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByText('No'));
    await waitFor(() => {
      expect(RootService.userLogout).not.toHaveBeenCalled();
    });
  });
});
