import { render, screen } from '@testing-library/react';
import Bookkeeper from './BkprRoot';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Bookkeeper component ', () => {
  beforeEach(() => render(<Bookkeeper />));

  it('should be in the document', () => {
    expect(screen.getByTestId('bookkeeper-container')).not.toBeEmptyDOMElement()
  });
});
