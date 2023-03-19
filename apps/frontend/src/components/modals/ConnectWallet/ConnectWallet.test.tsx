import { render, screen } from '@testing-library/react';
import ConnectWallet from './ConnectWallet';

describe('ConnectWallet component ', () => {
  beforeEach(() => render(<ConnectWallet />));

  it('should be in the document', () => {
    // expect(screen.getByTestId('header-context')).toBeInTheDocument();
  });

});
