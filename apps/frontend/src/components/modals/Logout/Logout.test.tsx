import { screen } from '@testing-library/react';
import Logout from './Logout';
import { renderWithMockCLNContext, getMockCLNStoreData, getMockRootStoreData } from '../../../utilities/test-utilities';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('Logout component ', () => {
  let providerRootProps;
  let providerCLNProps;
  beforeEach(() => {
    providerRootProps = JSON.parse(JSON.stringify(getMockRootStoreData('showModals', { logoutModal: true })));
    providerCLNProps = JSON.parse(JSON.stringify(getMockCLNStoreData()));
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    (useNavigate as jest.Mock).mockImplementation(() => jest.fn());
  });

  it('should be in the document', () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Logout />);
    expect(screen.getByTestId('logout-modal')).toBeInTheDocument();
  });

  it('if AppContext config says hide, hide this modal', () => {
    providerRootProps.showModals.logoutModal = false;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Logout />);
    expect(screen.queryByTestId('logout-modal')).not.toBeInTheDocument();
  });

});
