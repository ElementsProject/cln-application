import { screen } from '@testing-library/react';
import NodeInfo from './NodeInfo';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import { defaultRootState } from '../../../store/rootSelectors';
import { mockShowModals } from '../../../utilities/test-utilities/mockData';
import { defaultCLNState } from '../../../store/clnSelectors';
import { defaultBKPRState } from '../../../store/bkprSelectors';

describe('NodeInfo component ', () => {
  let customMockStore;
  beforeEach(() => {
    customMockStore = {
      root: {
        ...defaultRootState,
        showModals: {
          ...mockShowModals,
          nodeInfoModal: true,
        },
      },
      cln: defaultCLNState,
      bkpr: defaultBKPRState
    };
  });

  it('should be in the document', async () => {
    await renderWithProviders(<NodeInfo />, { preloadedState: customMockStore });
    expect(screen.getByTestId('node-info-modal')).toBeInTheDocument();
  });

  it('if AppContext config says hide, hide this modal', async () => {
    customMockStore.root.showModals.nodeInfoModal = false;
    await renderWithProviders(<NodeInfo />, { preloadedState: customMockStore });
    expect(screen.queryByTestId('node-info-modal')).not.toBeInTheDocument();
  });
});
