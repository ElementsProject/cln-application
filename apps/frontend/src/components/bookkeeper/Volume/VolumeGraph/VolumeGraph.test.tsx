import {
  getMockStoreData,
  mockVolumeData,
  renderWithMockContext,
} from '../../../../utilities/test-utilities';
import VolumeGraph from './VolumeGraph';

// TODO: unable to test due to unable to mock[TypeError: _d3$select$append$app.getBBox is not a function]
describe.skip('Volume Graph component ', () => {
  let providerProps = JSON.parse(JSON.stringify(getMockStoreData()));
  let container;

  beforeEach(() => {
    ({ container } = renderWithMockContext(
      <VolumeGraph volumeData={mockVolumeData} width={900} />,
      { providerProps },
    ));
  });

  it('should render the graph', () => {
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders correctly with empty data', () => {
    renderWithMockContext(
      <VolumeGraph
        volumeData={{ forwards: [], totalOutboundSat: 0, totalFeeSat: 0 }}
        width={900}
      />,
      {
        providerProps,
      },
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders inbound and outbound labels', () => {
    const inboundLabel = container.getByText('Inbound');
    const outboundLabel = container.getByText('Outbound');

    expect(inboundLabel).toBeInTheDocument();
    expect(outboundLabel).toBeInTheDocument();
  });
});
