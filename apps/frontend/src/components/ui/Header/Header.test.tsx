import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import Header from './Header';

describe('Header component ', () => {
  beforeEach(() => {});

  it('should be in the document', async () => {
    await renderWithProviders(<Header />, { preloadedState: mockAppStore, initialRoute: ['/cln'] })
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});
