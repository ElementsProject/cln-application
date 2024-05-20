import { screen } from '@testing-library/react';
import Logout from './Logout';
import { renderWithMockContext, getMockStoreData } from '../../../utilities/test-utilities';

describe('Logout component ', () => {
  let providerProps;
  beforeEach(() => providerProps = JSON.parse(JSON.stringify(getMockStoreData('showModals', { logoutModal: true }))));

  it('should be in the document', () => {
    renderWithMockContext(<Logout />, { providerProps });
    expect(screen.getByTestId('logout-modal')).toBeInTheDocument();
  });

  it('if AppContext config says hide, hide this modal', () => {
    providerProps.showModals.logoutModal = false;
    renderWithMockContext(<Logout />, { providerProps });
    expect(screen.queryByTestId('logout-modal')).not.toBeInTheDocument();
  });

});
