import { render, screen } from '@testing-library/react';
import LSPList from './LSPList';

describe('LSPList component ', () => {
  beforeEach(() => render(<LSPList />));

  it('should be in the document', () => {
    expect(screen.getByTestId('lsps-list')).toBeInTheDocument();
  });

});
