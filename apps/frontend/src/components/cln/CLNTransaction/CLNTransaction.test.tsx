import { screen } from '@testing-library/react';
import CLNTransaction from './CLNTransaction';
import { renderWithMockCLNContext, getMockCLNStoreData, mockClnTransaction, getMockRootStoreData } from '../../../utilities/test-utilities';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('CLNTransaction component ', () => {
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

  it('should be in the document', () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNTransaction transaction={mockClnTransaction} />);
    expect(screen.getByTestId('invoice')).toBeInTheDocument();
    expect(screen.queryByTestId('preimage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('valid-till')).not.toBeInTheDocument();
  });

});
