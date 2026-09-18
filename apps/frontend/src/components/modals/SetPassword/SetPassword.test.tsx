import { screen, fireEvent, waitFor } from '@testing-library/react';
import SetPasswordComponent from './SetPassword';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import { defaultRootState } from '../../../store/rootSelectors';
import { mockShowModals } from '../../../utilities/test-utilities/mockData';
import { defaultCLNState } from '../../../store/clnSelectors';
import { defaultBKPRState } from '../../../store/bkprSelectors';
import { RootService } from '../../../services/http.service';
import { MIN_PASSWORD_LENGTH } from '../../../utilities/constants';

describe('Password component ', () => {
  let customMockStore;
  const validPassword = 'a'.repeat(MIN_PASSWORD_LENGTH);
  const shortPassword = 'a'.repeat(MIN_PASSWORD_LENGTH - 1);

  const fillForm = (currPassword: string | null, newPassword: string, confirmPassword: string) => {
    if (currPassword !== null) {
      fireEvent.change(screen.getByPlaceholderText('Current Password'), { target: { value: currPassword } });
    }
    fireEvent.change(screen.getByPlaceholderText(`New Password (min ${MIN_PASSWORD_LENGTH} characters)`), { target: { value: newPassword } });
    fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: confirmPassword } });
  };

  beforeEach(() => {
    customMockStore = {
      root: {
        ...defaultRootState,
        showModals: {
          ...mockShowModals,
          setPasswordModal: true,
        },
      },
      cln: defaultCLNState,
      bkpr: defaultBKPRState
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be in the document', async () => {
    await renderWithProviders(<SetPasswordComponent />, { preloadedState: customMockStore });
    expect(screen.getByTestId('set-password-modal')).toBeInTheDocument();
  });

  it('if AppContext config says hide, hide this modal', async () => {
    customMockStore.root.showModals.setPasswordModal = false;
    await renderWithProviders(<SetPasswordComponent />, { preloadedState: customMockStore });
    expect(screen.queryByTestId('set-password-modal')).not.toBeInTheDocument();
  });

  it('rejects a new password shorter than the minimum length', async () => {
    const resetSpy = jest.spyOn(RootService, 'resetUserPassword');
    customMockStore.root.authStatus = { ...defaultRootState.authStatus, isValidPassword: false };
    await renderWithProviders(<SetPasswordComponent />, { preloadedState: customMockStore });
    fillForm(null, shortPassword, shortPassword);
    fireEvent.click(screen.getByRole('button', { name: /set password/i }));
    expect(await screen.findByText(`New Password must be at least ${MIN_PASSWORD_LENGTH} characters`)).toBeInTheDocument();
    expect(resetSpy).not.toHaveBeenCalled();
  });

  it('rejects a new password equal to the current password', async () => {
    const resetSpy = jest.spyOn(RootService, 'resetUserPassword');
    await renderWithProviders(<SetPasswordComponent />, { preloadedState: customMockStore });
    fillForm(validPassword, validPassword, validPassword);
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    expect(await screen.findByText('New Password must be different from Current Password')).toBeInTheDocument();
    expect(resetSpy).not.toHaveBeenCalled();
  });

  it('submits a new password that meets the rules', async () => {
    const resetSpy = jest.spyOn(RootService, 'resetUserPassword').mockResolvedValue({ isAuthenticated: true, isValidPassword: true, isLoading: false, error: null });
    await renderWithProviders(<SetPasswordComponent />, { preloadedState: customMockStore });
    const newPassword = 'b'.repeat(MIN_PASSWORD_LENGTH);
    fillForm(validPassword, newPassword, newPassword);
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    await waitFor(() => expect(resetSpy).toHaveBeenCalledTimes(1));
    expect(screen.queryByText(`New Password must be at least ${MIN_PASSWORD_LENGTH} characters`)).not.toBeInTheDocument();
  });
});
