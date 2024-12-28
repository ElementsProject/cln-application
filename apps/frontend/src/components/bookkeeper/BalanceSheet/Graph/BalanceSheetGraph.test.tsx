import { act, fireEvent, waitFor } from '@testing-library/react';
import BalanceSheetGraph from './BalanceSheetGraph';
import {
  getMockStoreData,
  mockBalanceSheetData,
  renderWithMockContext,
} from '../../../../utilities/test-utilities';

describe('Balance Sheet Graph component ', () => {
  let providerProps = JSON.parse(JSON.stringify(getMockStoreData()));
  let container;

  beforeEach(() => {
    ({ container } = renderWithMockContext(
      <BalanceSheetGraph balanceSheetData={mockBalanceSheetData} width={900} />,
      { providerProps },
    ));
  });

  it('should render the graph', () => {
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders correctly with empty data', () => {
    renderWithMockContext(<BalanceSheetGraph balanceSheetData={{ periods: [] }} width={900} />, {
      providerProps,
    });
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders correct number of bars for the periods', () => {
    const bars = container.querySelectorAll('g.bar-group');
    expect(bars.length).toBe(2);
  });

  it('displays tooltip with correct content on hover', async () => {
    const bar = container.querySelector('rect.bar');
    let tooltip = container.querySelector('.sats-flow-tooltip');

    expect(tooltip).toBeNull();
    expect(bar).not.toBeNull();

    await act(async () => fireEvent.mouseOver(bar));

    tooltip = await waitFor(() => {
      const tooltipElement = document.querySelector('.balance-sheet-tooltip');
      if (!tooltipElement) throw new Error('Tooltip not found');
      return tooltipElement;
    });

    expect(tooltip).toBeVisible();

    const tooltipText = tooltip.textContent?.replace(/\s+/g, ' ').trim();
    const expectedText = `
    Short Channel ID: 12345x12345x1
    Remote Alias: Wallet 1
    Balance: 500,000.000
    Percentage: 50%
    Account: onchain_wallet
    Total Period Balance: 1,000,000.000
    `
      .replace(/\s+/g, ' ')
      .trim();
    expect(tooltipText).toContain(expectedText);
  });

  it('hides tooltip on mouseout', async () => {
    const bar = container.querySelector('rect.bar');
    let tooltip = container.querySelector('.balance-sheet-tooltip');

    await act(async () => fireEvent.mouseOver(bar));

    tooltip = await waitFor(() => {
      const tooltipElement = document.querySelector('.balance-sheet-tooltip');
      if (!tooltipElement) throw new Error('Tooltip not found');
      return tooltipElement;
    });

    expect(tooltip).toBeVisible();

    await act(async () => fireEvent.mouseOut(bar));

    tooltip = await waitFor(() => {
      const tooltipElement = document.querySelector('.balance-sheet-tooltip');
      if (!tooltipElement) throw new Error('Tooltip not found');
      return tooltipElement;
    });

    expect(tooltip).not.toBeVisible();
  });
  it('renders the x-axis and y-axis correctly', () => {
    const xAxisLabels = container.querySelectorAll('.x-axis text');
    const yAxisLabels = container.querySelectorAll('.y-axis text');

    expect(xAxisLabels.length).toBe(mockBalanceSheetData.periods.length);
    expect(yAxisLabels.length).toBeGreaterThan(0);
    expect(xAxisLabels[0].textContent).toBe(mockBalanceSheetData.periods[0].periodKey);
  });
});
