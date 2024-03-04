import { render, screen } from '@testing-library/react';
import StatusAlert from './StatusAlert';
import { CallStatus } from '../../../utilities/constants';

describe('StatusAlert component ', () => {

  it('pending shows spinner, message is capitalized', () => {
    render(<StatusAlert responseStatus={CallStatus.PENDING} responseMessage='loading...' />)
    expect(screen.getByTestId('status-pending-spinner')).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it('CallStatus.None shows nothing', () => {
    render(<StatusAlert responseStatus={CallStatus.NONE} responseMessage='loading...' />)
    expect(screen.queryByTestId('status-pending-spinner')).not.toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

});
