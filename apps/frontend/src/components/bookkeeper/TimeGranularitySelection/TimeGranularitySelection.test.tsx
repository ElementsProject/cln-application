import { render, screen } from '@testing-library/react';
import TimeGranularitySelection from './TimeGranularitySelection';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Time Granularity component ', () => {
  beforeEach(() => render(<TimeGranularitySelection />));

  it('should be in the document', () => {
    expect(screen.getByTestId('time-granularity-selection')).not.toBeEmptyDOMElement()
  });
});
