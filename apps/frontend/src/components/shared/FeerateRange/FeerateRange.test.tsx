import { screen, render } from '@testing-library/react';
import { act } from 'react';
import { Provider } from 'react-redux';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';
import { createMockStore } from '../../../utilities/test-utilities/mockStore';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import FeerateRange from './FeerateRange';

describe('FeerateRange component ', () => {
  it('should be in the document', async () => {
    const store = createMockStore('/', mockAppStore);
    render(
      <Provider store={store}>
        <FeerateRange />
      </Provider>
    );
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    expect(screen.getByTestId('fee-rate-container')).toBeInTheDocument();
  });
});
