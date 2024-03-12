import { screen } from '@testing-library/react';
import Login from './Login';
import { renderWithMockContext, getMockStoreData } from '../../../utilities/test-utilities';

describe('Login component ', () => {
  let providerProps;
  beforeEach(() => providerProps = JSON.parse(JSON.stringify(getMockStoreData('showModals', { loginModal: true }))));
  
  it('should be in the document', () => {
    renderWithMockContext(<Login />, { providerProps });
    expect(screen.getByTestId('login-modal')).toBeInTheDocument();
  });

  it('if AppContext config says hide, hide this modal', () => {
    providerProps.showModals.loginModal = false;
    renderWithMockContext(<Login />, { providerProps });
    expect(screen.queryByTestId('login-modal')).not.toBeInTheDocument();
  });

});
