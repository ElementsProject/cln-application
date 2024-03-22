import { screen } from '@testing-library/react';
import CLNOffersList from './CLNOffersList';
import { renderWithMockContext, getMockStoreData } from '../../../utilities/test-utilities';

describe('CLNOffersList component ', () => {
  let providerProps;
  beforeEach(() => providerProps = JSON.parse(JSON.stringify(getMockStoreData())));

  it('if it is loading show the spinner', () => {
    providerProps.listOffers.isLoading = true;
    renderWithMockContext(<CLNOffersList />, { providerProps });
    expect(screen.getByTestId('cln-offers-list-spinner')).toBeInTheDocument();
  });

  it('if it is not loading dont show the spinner', () => {
    renderWithMockContext(<CLNOffersList />, { providerProps });
    expect(screen.queryByTestId('cln-offers-list-spinner')).not.toBeInTheDocument();
  })

  it('if it has an error, show the error view', () => {
    providerProps.listOffers.offers = [];
    providerProps.listOffers.error = "error message!";
    renderWithMockContext(<CLNOffersList />, { providerProps });
    expect(screen.getByTestId('cln-offers-list-error')).toBeInTheDocument();
  })

  it('if it has offers, show the offers list', () => {
    renderWithMockContext(<CLNOffersList />, { providerProps });
    const offersList = screen.getByTestId('cln-offers-list');

    expect(offersList).toBeInTheDocument();
    expect(offersList.children.length).toBe(1);
  })

  it('if there are no offers, show the on offers text', () => {
    providerProps.listOffers.offers = [];
    renderWithMockContext(<CLNOffersList />, { providerProps });
    expect(screen.getByText('No offer found. Click receive to generate new offer!')).toBeInTheDocument();
  })

});
