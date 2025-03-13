import { render, screen } from '@testing-library/react';
import LSPCard from './LSPCard';

describe('LSPCard component ', () => {
  beforeEach(
    () => render(<LSPCard />)
  );

  it('should be in the document', () => {
    expect(screen.getByTestId('lsps-card')).toBeInTheDocument();
  });
});
