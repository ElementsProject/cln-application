import { screen } from '@testing-library/react';
import NodeInfo from './NodeInfo';
import { renderWithMockContext, getMockStoreData } from '../../../utilities/test-utilities';

describe('NodeInfo component ', () => {
  let providerProps;
  beforeEach(() => providerProps = JSON.parse(JSON.stringify(getMockStoreData('showModals', { nodeInfoModal: true }))));

  it('should be in the document', async () => {
    renderWithMockContext(<NodeInfo />, { providerProps });
    expect(screen.getByTestId('node-info-modal')).toBeInTheDocument();
  });

  it('if AppContext config says hide, hide this modal', () => {
    providerProps.showModals.nodeInfoModal = false;
    renderWithMockContext(<NodeInfo />, { providerProps });
    expect(screen.queryByTestId('node-info-modal')).not.toBeInTheDocument();
  });

});
