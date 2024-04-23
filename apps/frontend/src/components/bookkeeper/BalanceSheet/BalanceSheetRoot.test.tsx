import { render, screen } from '@testing-library/react';
import BalanceSheetRoot from './BalanceSheetRoot';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Balance Sheet component ', () => {
  beforeEach(() => render(<BalanceSheetRoot />));

  it('should be in the document', () => {
    expect(screen.getByTestId('balancesheet-container')).not.toBeEmptyDOMElement()
  });
});
