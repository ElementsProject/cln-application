import { screen, render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { APP_ANIMATION_DURATION, Units } from '../../../utilities/constants';
import { createMockStore } from '../../../utilities/test-utilities/mockStore';
import { mockAppConfig, mockAppStore, mockBKPRStoreData, mockCLNStoreData, mockRootStoreData, mockUIConfig } from '../../../utilities/test-utilities/mockData';
import CurrencyBox from './CurrencyBox';

describe('CurrencyBox component ', () => {
  it('if not in shorten mode', async () => {
    const store = createMockStore('/', mockAppStore);
    render(
      <Provider store={store}>
        <CurrencyBox  value='2222222' shorten='false' />
      </Provider>
    );
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('2,222K');
  });

  it('if in shorten mode', async () => {
    const store = createMockStore('/', mockAppStore);
    render(
      <Provider store={store}>
        <CurrencyBox  value='11111111' shorten='true' />
      </Provider>
    );
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('11,111K');
  });

  it('if using BTC as the appConfig unit without shortening', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        appConfig: {
          ...mockAppConfig,
          uiConfig: {
            ...mockUIConfig,
            unit: Units.BTC
          }
        },
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    const store = createMockStore('/', customMockStore);
    render(
      <Provider store={store}>
        <CurrencyBox  value='11111111' shorten='false' />
      </Provider>
    );
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('0.11111');
  });

  it('if using BTC as the appConfig unit when shortened', async () => {
    const customMockStore = {
      root: {
        ...mockRootStoreData,
        appConfig: {
          ...mockAppConfig,
          uiConfig: {
            ...mockUIConfig,
            unit: Units.MSATS
          }
        },
      },
      cln: mockCLNStoreData,
      bkpr: mockBKPRStoreData
    };
    const store = createMockStore('/', customMockStore);
    render(
      <Provider store={store}>
        <CurrencyBox  value='11111111' shorten='true' />
      </Provider>
    );
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('11111111000');
  });
});
