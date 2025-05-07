import { screen } from '@testing-library/react';
import { mockAppStore, mockBKPRStoreData, mockCLNStoreData, mockNodeInfo, mockRootStoreData } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import CLNHome from './CLNHome';

describe('CLNHome Component', () => {
  it('should render error message when nodeInfo has an error', async () => {
    const errorMessage = 'Error loading node info';
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        nodeInfo: {
          ...mockNodeInfo,
          error: errorMessage
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<CLNHome />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render the full page', async () => {
    await renderWithProviders(<CLNHome />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('cln-container')).toBeInTheDocument();

    expect(screen.getByTestId('overview-total-balance-col')).toBeInTheDocument();
    expect(screen.getByTestId('btc-card')).toBeInTheDocument();
    expect(screen.getByTestId('cln-card')).toBeInTheDocument();
    expect(screen.getByTestId('channels-card')).toBeInTheDocument();
  });
});
