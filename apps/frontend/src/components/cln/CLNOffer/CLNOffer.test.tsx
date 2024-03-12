import { screen } from '@testing-library/react';
import CLNOffer from './CLNOffer';
import { renderWithMockContext, getMockStoreData, mockFirstOffer } from '../../../utilities/test-utilities';

describe('CLNOffer component ', () => {
  let providerProps;
  beforeEach(() => providerProps = JSON.parse(JSON.stringify(getMockStoreData())));

  it('should be in the document', () => {
    renderWithMockContext(<CLNOffer offer={mockFirstOffer}/>, { providerProps });
    expect(screen.getByTestId('cln-offer-detail')).toBeInTheDocument();
    expect(screen.getByText('lno1pwruza4cv00xgc8z2080w7kqjz5vunxrv4xvwu7fae60n0d4xqkdejwjcghwnghwhd0c8zugtfvslgzpfscghet0sqqqyqqqyqqqzqqqfqqqqrr9umvwg5a5nlkyjf0gz7wrc5gg40t8xflq2c23hyz0cyftmnz5kppafku2eurjg5rzr92kdwhd42w5pufheslp73jjl9euvvs32halutnggczp0kytwtrv28z2aw35z95m76x4ua2ds4l3nu05wt63u86jksql6t6qf')).toBeInTheDocument();
  });

});
