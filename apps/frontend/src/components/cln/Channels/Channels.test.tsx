import { screen } from '@testing-library/react';
import Channels from './Channels';
import { mockAppStore, mockBKPRStoreData, mockCLNStoreData, mockListChannels, mockRootStoreData } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';

describe('Channels component ', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<Channels />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('channels')).toBeInTheDocument();
  });

  it('if it is loading show the spinner', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        listChannels: {
          ...mockListChannels,
          isLoading: true
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<Channels />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('channels-spinner')).toBeInTheDocument();
  });

  it('if it is not loading dont show the spinner', async () => {
    await renderWithProviders(<Channels />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    expect(screen.queryByTestId('channels-spinner')).not.toBeInTheDocument();
  });

  it('if it has an error, show the error view', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        listChannels: {
          ...mockListChannels,
          error: 'error message'
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<Channels />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('channels-error')).toBeInTheDocument();
  });

  it('alias should display in the document', async () => {
    await renderWithProviders(<Channels />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    expect(screen.getAllByTestId('channel-node-alias')[0]).toHaveTextContent('SLICKERMAESTRO');
  });

  it('if no channels found, show open channel text', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        listChannels: {
          activeChannels: [],
          pendingChannels: [],
          inactiveChannels: [],
          mergedChannels: [],
          isLoading: false
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<Channels />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByText("No channel found. Open channel to start!")).toBeInTheDocument();
  })

});
