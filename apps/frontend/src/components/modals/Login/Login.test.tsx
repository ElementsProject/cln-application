import { screen, fireEvent, waitFor } from '@testing-library/react';
import { mockAppStore, mockAuthStatus, mockBKPRStoreData, mockCLNStoreData, mockRootStoreData, mockShowModals } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import SHA256 from "crypto-js/sha256";
import LoginComponent from './Login';
import { RootService } from '../../../services/http.service';
import { spyOnUserLogin } from '../../../utilities/test-utilities/mockService';

describe('Login component ', () => {
  const customMockStore = {
    root: {
      ...mockRootStoreData,
      authStatus: {
        isLoading: false,
        isAuthenticated: false,
        isValidPassword: false,
      },
      showModals: {
        ...mockShowModals,
        loginModal: true,
      }
    },
    cln: mockCLNStoreData,
    bkpr: mockBKPRStoreData
  };

  it('should render login modal when loginModal is true', async () => {
    await renderWithProviders(<LoginComponent />, { preloadedState: customMockStore });
    expect(screen.getByTestId('login-modal')).toBeInTheDocument();
  });

  it('if config says hide, hide this modal', async () => {
    await renderWithProviders(<LoginComponent />, { preloadedState: mockAppStore });
    expect(screen.queryByTestId('login-modal')).not.toBeInTheDocument();
  });

  it('calls RootService.userLogin with hashed password on login', async () => {
    spyOnUserLogin();
    const correctPassword = 'correctpassword';
    const hashedPassword = SHA256(correctPassword).toString();
    const { store } = await renderWithProviders(<LoginComponent />, { preloadedState: customMockStore });
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.change(passwordInput, { target: { value: correctPassword } });
    fireEvent.click(loginButton);
    await waitFor(() => {
      expect(RootService.userLogin).toHaveBeenCalledWith(hashedPassword);
    });
    await waitFor(() => {
      const state = store.getState();
      expect(state.root.authStatus).toEqual(mockAuthStatus);
    });
  });

  it('does not call login if password is empty', async () => {
    spyOnUserLogin();
    await renderWithProviders(<LoginComponent />, { preloadedState: customMockStore });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(RootService.userLogin).not.toHaveBeenCalled();
      expect(screen.getByText(/invalid password/i)).toBeInTheDocument();
    });
  });

});
