import { screen } from '@testing-library/react';
import SetPasswordComponent from './SetPassword';
import { renderWithMockCLNContext, getMockCLNStoreData, getMockRootStoreData } from '../../../utilities/test-utilities';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('Password component ', () => {
  let providerRootProps;
  let providerCLNProps;

  beforeEach(() => {
    providerCLNProps = JSON.parse(JSON.stringify(getMockCLNStoreData()));
    providerRootProps = JSON.parse(JSON.stringify(getMockRootStoreData('showModals', { setPasswordModal: true })));
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
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <SetPasswordComponent />);
    expect(screen.getByTestId('set-password-modal')).toBeInTheDocument();
  });

  it('if AppContext config says hide, hide this modal', () => {
    providerRootProps.showModals.setPasswordModal = false;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <SetPasswordComponent />);
    expect(screen.queryByTestId('set-password-modal')).not.toBeInTheDocument();
  });

});
