import { screen, render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';
import { createMockStore } from '../../../utilities/test-utilities/mockStore';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import ToggleSwitch from './ToggleSwitch';

describe('ToggleSwitch component ', () => {
  it('should be in the document', async () => {
    const store = createMockStore('/', mockAppStore);
    render(
      <Provider store={store}>
        <ToggleSwitch
          values={['SATS', 'BTC']}
          selIndex={0}
          onChange={() => {}}
        />
      </Provider>
    );
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    expect(screen.getByTestId('toggle-switch')).toBeInTheDocument();
  });
});
