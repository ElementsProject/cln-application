import { act, screen } from '@testing-library/react';
import CurrencyBox from './CurrencyBox';
import { APP_ANIMATION_DURATION, Units } from '../../../utilities/constants';
import { renderWithMockContext, mockStoreData } from '../../../utilities/test-utilities';

describe('CurrencyBox component ', () => {
  let providerProps;
  beforeEach(() => {
    providerProps = JSON.parse(JSON.stringify(mockStoreData));
    jest.useFakeTimers();
  });

  it('if not in shorten mode', async () => {
    renderWithMockContext(<CurrencyBox value='2222222' shorten='false' />, { providerProps });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('2,222K');
  })

  it('if in shorten mode', async () => {
    renderWithMockContext(<CurrencyBox value='11111111' shorten='true' />, { providerProps });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('11,111K');
  })

  it('if using BTC as the appConfig unit without shortening', async () => {
    providerProps.appConfig.uiConfig.unit = Units.BTC;
    renderWithMockContext(<CurrencyBox value='11111111' shorten='false' />, { providerProps });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('0.11111');
  })

  it('if using BTC as the appConfig unit when shortened', async () => {
    providerProps.appConfig.uiConfig.unit = Units.MSATS;
    renderWithMockContext(<CurrencyBox value='11111111' shorten='true' />, { providerProps });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('11111111000');
  })

});
