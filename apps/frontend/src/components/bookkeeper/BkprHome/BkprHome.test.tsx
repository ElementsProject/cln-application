import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import Bookkeeper from './BkprHome';
import { mockAppStore, mockBKPRStoreData, mockCLNStoreData, mockNodeInfo, mockRootStoreData } from '../../../utilities/test-utilities/mockData';
import { setMockedLocation } from '../../../setupTests';

describe('Bookkeeper Component', () => {
  beforeEach(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it('should render the dashboard container', async () => {
    setMockedLocation({ pathname: '/bookkeeper' });
    await renderWithProviders(<Bookkeeper />, { preloadedState: mockAppStore, initialRoute: ['/bookkeeper'] });
    expect(await screen.findByTestId('bookkeeper-dashboard-container')).toBeInTheDocument();
  });

  it('should render the subcomponents when path is /bookkeeper', async () => {
    setMockedLocation({ pathname: '/bookkeeper' });
    await renderWithProviders(<Bookkeeper />, {
      initialRoute: ['/bookkeeper'],
      preloadedState: mockAppStore,
    });
    expect(screen.getByTestId('account-event-info-container')).toBeInTheDocument();
    expect(screen.getByTestId('satsflow-info-container')).toBeInTheDocument();
    expect(screen.getByTestId('volume-info-container')).toBeInTheDocument();
  });

  it('should not render overview/cards if path is not /bookkeeper', async () => {
    setMockedLocation({ pathname: '/bookkeeper/satsflow' });
    await renderWithProviders(<Bookkeeper />, { preloadedState: mockAppStore, initialRoute: ['/bookkeeper/satsflow'] });
    expect(screen.queryByTestId('account-event-info-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('satsflow-info-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('volume-info-container')).not.toBeInTheDocument();
  });

  it('should display error message if nodeInfo has error', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        nodeInfo: {
          ...mockNodeInfo,
          error: 'Connection failed'
        }
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<Bookkeeper />, { preloadedState: customMockStore, initialRoute: ['/bookkeeper'] });
    expect(screen.getByText('Connection failed')).toBeInTheDocument();
  });
});
