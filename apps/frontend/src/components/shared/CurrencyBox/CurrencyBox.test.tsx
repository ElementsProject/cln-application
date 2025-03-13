import { act, screen } from '@testing-library/react';
import CurrencyBox from './CurrencyBox';
import { APP_ANIMATION_DURATION, Units } from '../../../utilities/constants';
import { renderWithMockCLNContext, getMockRootStoreData, getMockCLNStoreData } from '../../../utilities/test-utilities';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('CurrencyBox component ', () => {
  let providerRootProps;
  let providerCLNProps;

  beforeEach(() => {
    providerRootProps = JSON.parse(JSON.stringify(getMockRootStoreData()));
    providerCLNProps = JSON.parse(JSON.stringify(getMockCLNStoreData()));
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    (useNavigate as jest.Mock).mockImplementation(() => jest.fn());
    jest.useFakeTimers();
  });

  it('if not in shorten mode', async () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CurrencyBox value='2222222' shorten='false' />);
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('2,222K');
  })

  it('if in shorten mode', async () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CurrencyBox value='11111111' shorten='true' />);
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('11,111K');
  })

  it('if using BTC as the appConfig unit without shortening', async () => {
    providerRootProps.appConfig.uiConfig.unit = Units.BTC;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CurrencyBox value='11111111' shorten='false' />);
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('0.11111');
  })

  it('if using BTC as the appConfig unit when shortened', async () => {
    providerRootProps.appConfig.uiConfig.unit = Units.MSATS;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CurrencyBox value='11111111' shorten='true' />);
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    const currencyBox = await screen.findByTestId('currency-box-finished-text');
    expect(currencyBox).toBeInTheDocument();
    expect(currencyBox).toHaveTextContent('11111111000');
  })

});
