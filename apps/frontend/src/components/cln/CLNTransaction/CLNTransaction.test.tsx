import { screen } from '@testing-library/react';
import CLNTransaction from './CLNTransaction';
import { renderWithMockContext, getMockStoreData, mockClnTransaction } from '../../../utilities/test-utilities';

describe('CLNTransaction component ', () => {
  let providerProps;
  beforeEach(() => providerProps = JSON.parse(JSON.stringify(getMockStoreData())));

  it('should be in the document', () => {
    renderWithMockContext(<CLNTransaction transaction={mockClnTransaction} />, { providerProps });
    expect(screen.getByTestId('invoice')).toBeInTheDocument();
    expect(screen.queryByTestId('preimage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('valid-till')).not.toBeInTheDocument();
  });

});
