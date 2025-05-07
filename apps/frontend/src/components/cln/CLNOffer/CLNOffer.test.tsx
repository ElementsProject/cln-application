import { fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { mockAppStore, mockOffer1 } from '../../../utilities/test-utilities/mockData';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import CLNOffer from './CLNOffer';

describe('CLNOffer component ', () => {
  it('should be in the document', async () => {
    await renderWithProviders(<CLNOffer />, { preloadedState: mockAppStore, initialRoute: ['/cln'] });

    // Initial state
    expect(screen.getByTestId('cln-offers-list')).toBeInTheDocument();

    // Click to expand
    const expandDiv = await screen.getByTestId('cln-offer-header');
    fireEvent.click(expandDiv);

    await act(async () => {
      let safety = 0;
      while (jest.getTimerCount() > 0 && safety++ < 100) {
        jest.runOnlyPendingTimers();
        await Promise.resolve();
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('cln-offer-detail')).toBeInTheDocument();
      expect(screen.getByText(mockOffer1.bolt12)).toBeInTheDocument();
    });
  });
});
