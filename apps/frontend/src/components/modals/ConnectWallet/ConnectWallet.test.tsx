import { act, screen } from '@testing-library/react';
import ConnectWallet from './ConnectWallet';
import { renderWithMockContext, getMockStoreData } from '../../../utilities/test-utilities';
import { APP_ANIMATION_DURATION } from '../../../utilities/constants';

describe('ConnectWallet component ', () => {
  let providerProps;
  beforeEach(() => {
    providerProps = JSON.parse(JSON.stringify(getMockStoreData('showModals', { connectWalletModal: true })));
    jest.useFakeTimers();
  });

  it('should be in the document', async () => {
    renderWithMockContext(<ConnectWallet />, { providerProps });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    expect(screen.getByTestId('connect-wallet')).toBeInTheDocument();
  });

  it('hide ConnectWallet modal if AppContext says to hide it', async () => {
    providerProps.showModals.connectWalletModal = false;
    renderWithMockContext(<ConnectWallet />, { providerProps });
    await act(async () => jest.advanceTimersByTime(APP_ANIMATION_DURATION * 1000));
    expect(screen.queryByTestId('connect-wallet')).not.toBeInTheDocument();
  });

});
