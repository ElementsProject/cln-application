import { screen } from '@testing-library/react';
import CLNOffer from './CLNOffer';
import { renderWithMockContext, getMockStoreData, mockOffer } from '../../../utilities/test-utilities';

describe('CLNOffer component ', () => {
  let providerProps;
  beforeEach(() => providerProps = JSON.parse(JSON.stringify(getMockStoreData())));

  it('should be in the document', () => {
    renderWithMockContext(<CLNOffer offer={mockOffer}/>, { providerProps });
    expect(screen.getByTestId('cln-offer-detail')).toBeInTheDocument();
    expect(screen.getByText('lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrm9deu7xyfzrcgq3rcdrqqpgg5uethwvs8xatzwd3hy6tsw35k7mskyyp68zdn5tm65mulfnxpnu4a0ght4q6ev6v7s6m3tj4259rlcdlnz3q')).toBeInTheDocument();
  });

});
