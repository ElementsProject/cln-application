import { screen, render } from '@testing-library/react';
import { act } from 'react';
import { Provider } from 'react-redux';
import { createMockStore } from '../../../utilities/test-utilities/mockStore';
import { mockAppStore } from '../../../utilities/test-utilities/mockData';
import ToastMessage from './ToastMessage';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';

describe('ToastMessage component ', () => {
  it('should be in the document', async () => {
    const defaultToastProps = {
      showOnComponent: true,
      show: true,
      message: 'my message',
      delay: 0,
      onConfirmResponse: jest.fn()
    };
    const store = createMockStore('/', mockAppStore);
    render(
      <Provider store={store}>
        <ToastMessage {...defaultToastProps} />
      </Provider>
    );
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    expect(screen.getByTestId('toast-body')).toBeInTheDocument();
  });
});
