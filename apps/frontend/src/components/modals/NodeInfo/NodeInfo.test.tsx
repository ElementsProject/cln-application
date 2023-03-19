import { render, screen } from '@testing-library/react';
import NodeInfo from './NodeInfo';

describe('NodeInfo component ', () => {
  beforeEach(() => render(<NodeInfo />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
