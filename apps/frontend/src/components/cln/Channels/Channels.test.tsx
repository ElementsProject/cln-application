import { render, screen } from '@testing-library/react';
import Channels from './Channels';
import { getMockStoreData, renderWithMockContext } from '../../../utilities/test-utilities';

describe('Channels component ', () => {
  let providerProps;
  beforeEach(() => providerProps = JSON.parse(JSON.stringify(getMockStoreData())));
  beforeEach(() => render(<Channels />));

  it('should be in the document', () => {
    expect(screen.getByTestId('channels')).toBeInTheDocument();
  });

  it('if it is loading show the spinner', () => {
    providerProps.listChannels.isLoading = true;
    renderWithMockContext(<Channels />, { providerProps });
    expect(screen.getByTestId('channels-spinner')).toBeInTheDocument();
  });

  it('if it is not loading dont show the spinner', () => {
    renderWithMockContext(<Channels />, { providerProps });
    expect(screen.queryByTestId('channels-spinner')).not.toBeInTheDocument();
  });

  it('if it has an error, show the error view', () => {
    providerProps.listChannels.error = "error message";
    renderWithMockContext(<Channels />, { providerProps });
    expect(screen.getByTestId('channels-error')).toBeInTheDocument();
  })

  it('alias should display in the document', () => {
    renderWithMockContext(<Channels />, { providerProps });
    expect(screen.getByText("my_alias")).toBeInTheDocument();
  })

  it('if no channels found, show open channel text', () => {
    providerProps.listChannels.activeChannels = [];
    expect(screen.getByText("No channel found. Open channel to start!")).toBeInTheDocument();
  })

});
