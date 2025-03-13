import { screen } from '@testing-library/react';
import CLNOffer from './CLNOffer';
import { renderWithMockCLNContext, getMockCLNStoreData, mockOffer, getMockRootStoreData } from '../../../utilities/test-utilities';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('CLNOffer component ', () => {
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

  it('should be in the document', () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNOffer offer={mockOffer}/>);
    expect(screen.getByTestId('cln-offer-detail')).toBeInTheDocument();
    expect(screen.getByText('lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrm9deu7xyfzrcgq3rcdrqqpgg5uethwvs8xatzwd3hy6tsw35k7mskyyp68zdn5tm65mulfnxpnu4a0ght4q6ev6v7s6m3tj4259rlcdlnz3q')).toBeInTheDocument();
  });

});
