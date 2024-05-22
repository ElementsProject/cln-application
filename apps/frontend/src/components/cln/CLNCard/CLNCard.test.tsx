import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CLNCard from './CLNCard';

describe('CLNCard component ', () => {
  beforeEach(() => render(<CLNCard />));

  it('should be in the document', () => {
    expect(screen.getByTestId('cln-card')).not.toBeEmptyDOMElement();
  });
});
