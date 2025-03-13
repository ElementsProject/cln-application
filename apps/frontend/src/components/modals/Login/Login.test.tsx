import { screen } from '@testing-library/react';
import Login from './Login';
import { renderWithMockCLNContext, getMockCLNStoreData, getMockRootStoreData } from '../../../utilities/test-utilities';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('Login component ', () => {
  let providerRootProps;
  let providerCLNProps;

  beforeEach(() => {
    providerRootProps = JSON.parse(JSON.stringify(getMockRootStoreData('showModals', { loginModal: true })));
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
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Login />);
    expect(screen.getByTestId('login-modal')).toBeInTheDocument();
  });

  it('if AppContext config says hide, hide this modal', () => {
    providerRootProps.showModals.loginModal = false;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Login />);
    expect(screen.queryByTestId('login-modal')).not.toBeInTheDocument();
  });

});
