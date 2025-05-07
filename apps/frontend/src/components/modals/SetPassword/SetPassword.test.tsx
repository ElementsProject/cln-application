import { screen } from '@testing-library/react';
import SetPasswordComponent from './SetPassword';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import { defaultRootState } from '../../../store/rootSelectors';
import { mockShowModals } from '../../../utilities/test-utilities/mockData';
import { defaultCLNState } from '../../../store/clnSelectors';
import { defaultBKPRState } from '../../../store/bkprSelectors';

describe('Password component ', () => {
  let customMockStore;
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

  it('should be in the document', async () => {
    await renderWithProviders(<SetPasswordComponent />, { preloadedState: customMockStore });
    expect(screen.getByTestId('set-password-modal')).toBeInTheDocument();
  });

  it('if AppContext config says hide, hide this modal', async () => {
    customMockStore.root.showModals.setPasswordModal = false;
    await renderWithProviders(<SetPasswordComponent />, { preloadedState: customMockStore });
    expect(screen.queryByTestId('set-password-modal')).not.toBeInTheDocument();
  });
});
