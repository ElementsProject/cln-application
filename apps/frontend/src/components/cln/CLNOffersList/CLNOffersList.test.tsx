import { screen } from '@testing-library/react';
import { mockAppStore, mockBKPRStoreData, mockCLNStoreData, mockListOffers, mockRootStoreData } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import CLNOffersList from './CLNOffersList';

describe('CLNOffersList component ', () => {
  it('if it is loading show the spinner', async () => {
    const customMockStore = {
      root: mockRootStoreData,
      cln: {
        ...mockCLNStoreData,
        listOffers: {
          ...mockListOffers,
          isLoading: true
        }
      },
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<CLNOffersList />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('cln-offers-list-spinner')).toBeInTheDocument();
  });

  it('if it is not loading dont show the spinner', async () => {
    await renderWithProviders(<CLNOffersList />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    expect(screen.queryByTestId('cln-offers-list-spinner')).not.toBeInTheDocument();
  });

  it('if it has an error, show the error view', async () => {
    const customMockStore = {
      root: mockRootStoreData,
      cln: {
        ...mockCLNStoreData,
        listOffers: {
          isLoading: false,
          offers: [],
          error: 'error message'
        }
      },
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<CLNOffersList />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByTestId('cln-offers-list-error')).toBeInTheDocument();
  });

  it('if it has offers, show the offers list', async () => {
    await renderWithProviders(<CLNOffersList />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });
    const offersList = screen.getByTestId('cln-offers-list');

    expect(offersList).toBeInTheDocument();
    expect(offersList.children.length).toBe(1);
  });

  it('if there are no offers, show the on offers text', async () => {
    const customMockStore = {
      root: mockRootStoreData,
      cln: {
        ...mockCLNStoreData,
        listOffers: {
          isLoading: false,
          offers: [],
        }
      },
      bkpr: mockBKPRStoreData
    };
    await renderWithProviders(<CLNOffersList />, { preloadedState: customMockStore, initialRoute: ['/cln'] });
    expect(screen.getByText('No offer found. Click receive to generate new offer!')).toBeInTheDocument();
  })

});
