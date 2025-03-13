import { render, screen } from '@testing-library/react';
import CapacityCard from './CapacityCard';

describe('CapacityCard component ', () => {
  beforeEach(() => render(<CapacityCard />));

  it('should be in the document', () => {
    expect(screen.getByTestId('capacity-card')).toBeInTheDocument();
  });
});
