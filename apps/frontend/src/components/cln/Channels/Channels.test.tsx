import { render, screen } from '@testing-library/react';
import Channels from './Channels';
import { getMockCLNStoreData, getMockRootStoreData, renderWithMockCLNContext } from '../../../utilities/test-utilities';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('Channels component ', () => {
  let providerRootProps;
  let providerCLNProps;

  beforeEach(() => {
    providerRootProps = JSON.parse(JSON.stringify(getMockRootStoreData()));
    providerCLNProps = JSON.parse(JSON.stringify(getMockCLNStoreData()));
    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/cln',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }));
    (useNavigate as jest.Mock).mockImplementation(() => jest.fn());
  });
  beforeEach(() => render(<Channels />));

  it('should be in the document', () => {
    expect(screen.getByTestId('channels')).toBeInTheDocument();
  });

  it('if it is loading show the spinner', () => {
    providerCLNProps.listChannels.isLoading = true;
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Channels />,);
    expect(screen.getByTestId('channels-spinner')).toBeInTheDocument();
  });

  it('if it is not loading dont show the spinner', () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Channels />,);
    expect(screen.queryByTestId('channels-spinner')).not.toBeInTheDocument();
  });

  it('if it has an error, show the error view', () => {
    providerCLNProps.listChannels.error = "error message";
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Channels />,);
    expect(screen.getByTestId('channels-error')).toBeInTheDocument();
  })

  it('alias should display in the document', () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <Channels />,);
    expect(screen.getByText('LNDReg')).toBeInTheDocument();
  })

  it('if no channels found, show open channel text', () => {
    providerCLNProps.listChannels.activeChannels = [];
    expect(screen.getByText("No channel found. Open channel to start!")).toBeInTheDocument();
  })

});
