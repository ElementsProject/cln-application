import SatsFlowGraph from './SatsFlowGraph';
import {
  getMockStoreData,
  mockSatsFlowData,
  renderWithMockContext,
} from '../../../../utilities/test-utilities';
import { act, fireEvent, waitFor } from '@testing-library/react';

describe('Sats Flow Graph component ', () => {
  let providerProps = JSON.parse(JSON.stringify(getMockStoreData()));
  let container;

  beforeEach(() => {
    ({ container } = renderWithMockContext(
      <SatsFlowGraph satsFlowData={mockSatsFlowData} width={900} />,
      {
        providerProps,
      },
    ));
  });

  it('should render the graph', () => {
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders correctly with empty data', () => {
    renderWithMockContext(<SatsFlowGraph satsFlowData={{ periods: [] }} width={900} />, {
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
      const tooltipElement = document.querySelector('.sats-flow-tooltip');
      if (!tooltipElement) throw new Error('Tooltip not found');
      return tooltipElement;
    });

    expect(tooltip).toBeVisible();

    const tooltipText = tooltip.textContent?.replace(/\s+/g, ' ').trim();
    const expectedText = `
    Event Tag: deposit
    Net Inflow: 800.000
    Credits: 1,000.000
    Debits: 200.000
    Volume: 1,200.000
    Period Inflow: 1,500.000
    Period Outflow: 200.000
    Period Net Inflow: 1,300.000
    Period Volume: 1,700.000
  `
      .replace(/\s+/g, ' ')
      .trim();
    expect(tooltipText).toContain(expectedText);
  });

  it('hides tooltip on mouseout', async () => {
    const bar = container.querySelector('rect.bar');
    let tooltip = container.querySelector('.sats-flow-tooltip');

    await act(async () => fireEvent.mouseOver(bar));

    tooltip = await waitFor(() => {
      const tooltipElement = document.querySelector('.sats-flow-tooltip');
      if (!tooltipElement) throw new Error('Tooltip not found');
      return tooltipElement;
    });

    expect(tooltip).toBeVisible();

    await act(async () => fireEvent.mouseOut(bar));

    tooltip = await waitFor(() => {
      const tooltipElement = document.querySelector('.sats-flow-tooltip');
      if (!tooltipElement) throw new Error('Tooltip not found');
      return tooltipElement;
    });

    expect(tooltip).not.toBeVisible();
  });

  it('renders the x-axis and y-axis correctly', () => {
    const xAxisLabels = container.querySelectorAll('.x-axis-labels text');
    const yAxisLabels = container.querySelectorAll('.y-axis text');

    expect(xAxisLabels.length).toBe(2);
    expect(yAxisLabels.length).toBeGreaterThan(0);
  });
});
