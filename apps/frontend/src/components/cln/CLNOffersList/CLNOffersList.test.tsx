import { screen } from '@testing-library/react';
import CLNOffersList from './CLNOffersList';
import { renderWithMockCLNContext, getMockCLNStoreData, getMockRootStoreData } from '../../../utilities/test-utilities';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('CLNOffersList component ', () => {
  let providerRootProps;
  let providerCLNProps;

  beforeEach(() => {
    providerRootProps = JSON.parse(JSON.stringify(getMockRootStoreData()));
    providerCLNProps = JSON.parse(JSON.stringify(getMockCLNStoreData()));
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/cln',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    (useNavigate as jest.Mock).mockImplementation(() => jest.fn());
  });

  it('if it is loading show the spinner', () => {
    providerCLNProps.listOffers.isLoading = true;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNOffersList />,);
    expect(screen.getByTestId('cln-offers-list-spinner')).toBeInTheDocument();
  });

  it('if it is not loading dont show the spinner', () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNOffersList />,);
    expect(screen.queryByTestId('cln-offers-list-spinner')).not.toBeInTheDocument();
  })

  it('if it has an error, show the error view', () => {
    providerCLNProps.listOffers.offers = [];
    providerCLNProps.listOffers.error = "error message!";
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNOffersList />,);
    expect(screen.getByTestId('cln-offers-list-error')).toBeInTheDocument();
  })

  it('if it has offers, show the offers list', () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNOffersList />,);
    const offersList = screen.getByTestId('cln-offers-list');

    expect(offersList).toBeInTheDocument();
    expect(offersList.children.length).toBe(1);
  })

  it('if there are no offers, show the on offers text', () => {
    providerCLNProps.listOffers.offers = [];
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNOffersList />,);
    expect(screen.getByText('No offer found. Click receive to generate new offer!')).toBeInTheDocument();
  })

});
