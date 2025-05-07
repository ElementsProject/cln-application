import { screen } from '@testing-library/react';
import { act } from 'react';
import { TRANSITION_DURATION } from '../../../utilities/constants';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import RouteTransition from './RouteTransition';

describe('RouteTransition', () => {
  it('renders without crashing', async () => {
    await renderWithProviders(<RouteTransition />, {initialRoute: ['/'] });
    expect(screen.getByTestId('route-transition')).toBeInTheDocument();
  });

  it('applies correct initial animation state', async () => {
    await renderWithProviders(<RouteTransition />, { initialRoute: ['/'] });
    const motionDiv = screen.getByTestId('route-transition');
    expect(motionDiv).toHaveStyle({
      opacity: '0',
      transform: 'translateY(20px) translateZ(0)',
    });
  });

  it('animates correctly during route transitions', async () => {
    const { router } = await renderWithProviders(<RouteTransition />, { initialRoute: ['/cln'] });
    let motionDivRoot = screen.getByTestId('route-transition');
    expect(motionDivRoot).toHaveStyle({ opacity: '0', transform: 'translateY(20px) translateZ(0)' });

    // Wait for Initial route animation
    await act(async () => {
      let safety = 0;
      while (jest.getTimerCount() > 0 && safety++ < 100) {
        jest.runOnlyPendingTimers();
        await Promise.resolve();
      }
    });

    expect(motionDivRoot).toHaveStyle({ opacity: '1', transform: 'none' });
  
    // Navigate to new route
    await act(() => router.navigate('/bookkeeper'));

    // Advance timers for new route animation
    act(() => {
      jest.advanceTimersByTime(TRANSITION_DURATION * 1000);
    });
  
    // New route should be visible
    expect(screen.getByTestId('bookkeeper-dashboard-container')).toBeInTheDocument();
    // Bookkeeper has child routes too
    let motionDivsBkpr = screen.getAllByTestId('route-transition');
    expect(motionDivsBkpr[0]).toHaveStyle({ opacity: '1', transform: 'none' });
  });

  it('scrolls to top on route change', async () => {
    const mockScrollTo = window.scrollTo as jest.Mock;
    mockScrollTo.mockImplementation(() => {});
  
    const { router } = await renderWithProviders(<RouteTransition />, { initialRoute: ['/'] });
  
    // Initial render should trigger scroll
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  
    mockScrollTo.mockClear();
  
    // Route change should trigger scroll again
    await act(async () => { await router.navigate('/bookkeeper') });
  
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

});
