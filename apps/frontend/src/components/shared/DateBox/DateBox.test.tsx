import { screen, render } from '@testing-library/react';
import DateBox from './DateBox';
import { mockAppStore, mockInvoice } from '../../../utilities/test-utilities/mockData';
import { convertIntoDateFormat } from '../../../utilities/data-formatters';
import { createMockStore } from '../../../utilities/test-utilities/mockStore';
import { Provider } from 'react-redux';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';
import { act } from 'react';

describe('DateBox component ', () => {
  it('format date', async () => {
    const store = createMockStore('/', mockAppStore);
    render(
      <Provider store={store}>
        <DateBox dataValue={mockInvoice.expires_at} dataType={'Created At'} showTooltip={false} />
      </Provider>
    );
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const overlayTrigger = screen.getByTestId('overlay-trigger');
    expect(overlayTrigger).toHaveTextContent(convertIntoDateFormat(mockInvoice.expires_at));
  });
});
