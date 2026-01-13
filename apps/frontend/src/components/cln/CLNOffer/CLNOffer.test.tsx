import { fireEvent, screen, waitFor, act } from '@testing-library/react';
import { mockAppStore, mockOffer1 } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import CLNOffer from './CLNOffer';

describe('CLNOffer component ', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<CLNOffer />, { 
      preloadedState: mockAppStore, 
      initialRoute: ['/cln'] 
    });

    // Advance timers for initial render animations
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // Initial state
    expect(screen.getByTestId('cln-offers-list')).toBeInTheDocument();

    // Click to expand
    const expandDiv = screen.getByTestId('cln-offer-header');
    
    await act(async () => {
      fireEvent.click(expandDiv);
      // Advance timers for expand animation
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('cln-offer-detail')).toBeInTheDocument();
      expect(screen.getByText(mockOffer1.bolt12)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
