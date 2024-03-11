import { render, screen } from '@testing-library/react';
import BTCCard from './BTCCard';

describe('BTCCard component ', () => {
  beforeEach(() => render(<BTCCard />));

  it('should be in the document', () => {
    expect(screen.getByTestId('btc-card')).not.toBeEmptyDOMElement()
  });
});
