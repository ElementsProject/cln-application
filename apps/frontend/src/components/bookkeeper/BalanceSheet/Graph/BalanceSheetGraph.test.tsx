import { render, screen } from '@testing-library/react';
import BalanceSheetGraph from './BalanceSheetGraph';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe.skip('Balance Sheet Graph component ', () => {
  beforeEach(() => render(<BalanceSheetGraph balanceSheetData={undefined} />));

  it('should be in the document', () => {
    expect(screen.getByTestId('balancesheetgraph-container')).not.toBeEmptyDOMElement()
  });
});
