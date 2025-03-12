import { screen } from '@testing-library/react';
import NodeInfo from './NodeInfo';
import { renderWithMockCLNContext, getMockCLNStoreData, getMockRootStoreData } from '../../../utilities/test-utilities';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('NodeInfo component ', () => {
  let providerRootProps;
  let providerCLNProps;

  beforeEach(() => {
    providerCLNProps = JSON.parse(JSON.stringify(getMockCLNStoreData()));
    providerRootProps = JSON.parse(JSON.stringify(getMockRootStoreData('showModals', { nodeInfoModal: true })));
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    (useNavigate as jest.Mock).mockImplementation(() => jest.fn());
  });

  it('should be in the document', async () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <NodeInfo />);
    expect(screen.getByTestId('node-info-modal')).toBeInTheDocument();
  });

  it('if AppContext config says hide, hide this modal', () => {
    providerRootProps.showModals.nodeInfoModal = false;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <NodeInfo />);
    expect(screen.queryByTestId('node-info-modal')).not.toBeInTheDocument();
  });

});
