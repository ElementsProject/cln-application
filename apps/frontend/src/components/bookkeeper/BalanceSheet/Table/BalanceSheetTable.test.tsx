import { render, screen } from '@testing-library/react';
import BalanceSheetTable from './BalanceSheetTable';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Balance Sheet Table component ', () => {
  beforeEach(() => render(<BalanceSheetTable balanceSheetData={undefined} />));

  it('should be in the document', () => {
    expect(screen.getByTestId('balancesheettable-container')).not.toBeEmptyDOMElement()
  });
});
