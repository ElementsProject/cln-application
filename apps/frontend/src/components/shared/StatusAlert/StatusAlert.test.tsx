import { screen, render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';
import { createMockStore } from '../../../utilities/test-utilities/mockStore';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import StatusAlert from './StatusAlert';
import { CallStatus } from '../../../utilities/constants';

describe('StatusAlert component ', () => {
  it('pending shows spinner, message is capitalized', async () => {
    const store = createMockStore('/', mockAppStore);
    render(
      <Provider store={store}>
        <StatusAlert responseStatus={CallStatus.PENDING} responseMessage="loading..." />
      </Provider>
    );
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    expect(screen.getByTestId('status-pending-spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('CallStatus.None shows nothing', async () => {
    const store = createMockStore('/', mockAppStore);
    render(
      <Provider store={store}>
        <StatusAlert responseStatus={CallStatus.NONE} responseMessage="loading..." />
      </Provider>
    );
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    expect(screen.queryByTestId('status-pending-spinner')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
