import { act, fireEvent, screen } from '@testing-library/react';
import Bookkeeper from './BkprRoot';
import { useNavigate } from 'react-router-dom';
import { getMockStoreData, renderWithMockContext } from '../../../utilities/test-utilities';

describe('Bookkeeper component ', () => {
  let mockNavigate: jest.Mock;
  let providerProps = JSON.parse(JSON.stringify(getMockStoreData()));

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    renderWithMockContext(<Bookkeeper />, { providerProps });
  });

  it('should be in the document', () => {
    expect(screen.getByTestId('bookkeeper-container')).not.toBeEmptyDOMElement();
  });

  it('should display the dashboard header', () => {
    expect(screen.getByText('Bookkeeper Dashboard')).toBeInTheDocument();
  });

  it('should display the Balance Sheet section', () => {
    expect(screen.getByText('Balance Sheet')).toBeInTheDocument();
    expect(screen.getByText('Total Number of Channels')).toBeInTheDocument();
    expect(screen.getByText('Total Balance in Channels')).toBeInTheDocument();
    expect(screen.getByText('Total Balance in Wallet')).toBeInTheDocument();
  });

  it('should display the Sats Flow section', () => {
    expect(screen.getByText('Sats Flow')).toBeInTheDocument();
    expect(screen.getByText('Inflow this month')).toBeInTheDocument();
    expect(screen.getByText('Outflow this month')).toBeInTheDocument();
  });

  it('should display the Volume Chart section', () => {
    expect(screen.getByText('Volume Chart')).toBeInTheDocument();
    expect(screen.getByText('Track route performance.')).toBeInTheDocument();
  });

  it('should navigate to Terminal when the Terminal button is clicked', async () => {
    const terminalButton = screen.getByText('Terminal');
    await act(async () => fireEvent.click(terminalButton));

    expect(mockNavigate).toHaveBeenCalledWith('/bookkeeper/terminal');
  });

  it('should navigate to Balance Sheet on View More click', async () => {
    const viewMoreButton = screen.getAllByText('View More')[0];
    await act(async () => fireEvent.click(viewMoreButton));

    expect(mockNavigate).toHaveBeenCalledWith('/bookkeeper/balancesheet');
  });

  it('should navigate to Sats Flow on View More click', async () => {
    const viewMoreButton = screen.getAllByText('View More')[1];
    await act(async () => fireEvent.click(viewMoreButton));

    expect(mockNavigate).toHaveBeenCalledWith('/bookkeeper/satsflow');
  });

  it('should navigate to Volume on View More click', async () => {
    const viewMoreButton = screen.getAllByText('View More')[2];
    await act(async () => fireEvent.click(viewMoreButton));

    expect(mockNavigate).toHaveBeenCalledWith('/bookkeeper/volume');
  });

  it('should display fetched data when available', async () => {
    expect(await screen.findByText('5')).toBeInTheDocument();
    expect(await screen.findByText('100,000.000')).toBeInTheDocument();
    expect(await screen.findByText('50,000.000')).toBeInTheDocument();
    expect(await screen.findByText('2,000.000')).toBeInTheDocument();
    expect(await screen.findByText('−1,000.000')).toBeInTheDocument();
    expect(await screen.findByText('route1')).toBeInTheDocument();
    expect(await screen.findByText('route2')).toBeInTheDocument();
  });
});
