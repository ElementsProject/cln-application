import { screen } from '@testing-library/react';
import SetPasswordComponent from './SetPassword';
import { renderWithMockContext, getMockStoreData } from '../../../utilities/test-utilities';

describe('Password component ', () => {
  let providerProps;
  beforeEach(() => providerProps = JSON.parse(JSON.stringify(getMockStoreData('showModals', { setPasswordModal: true }))));

  it('should be in the document', () => {
    renderWithMockContext(<SetPasswordComponent />, { providerProps });
    expect(screen.getByTestId('set-password-modal')).toBeInTheDocument();
  });

  it('if AppContext config says hide, hide this modal', () => {
    providerProps.showModals.setPasswordModal = false;
    renderWithMockContext(<SetPasswordComponent />, { providerProps });
    expect(screen.queryByTestId('set-password-modal')).not.toBeInTheDocument();
  });

});
