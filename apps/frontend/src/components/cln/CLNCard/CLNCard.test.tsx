import { render, screen } from '@testing-library/react';
import CLNCard from './CLNCard';

describe('CLNCard component ', () => {
  beforeEach(() => render(<CLNCard />));

  it('should be in the document', () => {
    expect(screen.getByTestId('cln-card')).not.toBeEmptyDOMElement();
  });
});
