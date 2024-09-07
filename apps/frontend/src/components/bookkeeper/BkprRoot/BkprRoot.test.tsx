import { render, screen } from '@testing-library/react';
import Bookkeeper from './BkprRoot';

describe('Bookkeeper component ', () => {
  beforeEach(() => render(<Bookkeeper />));

  it('should be in the document', () => {
    expect(screen.getByTestId('bookkeeper-container')).not.toBeEmptyDOMElement()
  });
});
