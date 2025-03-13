import { act, fireEvent, screen } from '@testing-library/react';
import CLNSend from './CLNSend';
import { getMockCLNStoreData, getMockRootStoreData, renderWithMockCLNContext } from '../../../utilities/test-utilities';
import { useLocation, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('CLNSend component ', () => {
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
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNSend />);
    expect(screen.getByTestId('cln-send')).toBeInTheDocument();
  });

  it('should accept lowercase invoice', async () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNSend />);

    const invoiceInput = screen.getByTestId("address-input");
    const testInvoice = 'lnb12345';
    await act(async () => fireEvent.change(invoiceInput, { target: { value: testInvoice } }));

    expect(screen.queryByText('Invalid Invoice')).not.toBeInTheDocument();
  });
  
  it('should accept UPPERCASE invoice', async () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNSend />);

    const invoiceInput = screen.getByTestId("address-input");
    const testInvoice = "LNB12345";
    await act(async () => fireEvent.change(invoiceInput, { target: { value: testInvoice } }));

    expect(screen.queryByText("Invalid Invoice")).not.toBeInTheDocument();
  });

  it('should accept lowercase offer', async () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNSend />);

    const offerRadioButton = screen.getByLabelText("Offer");
    await act(async () => fireEvent.click(offerRadioButton));

    const offerInput = screen.getByTestId("address-input");
    const testOffer = "lno12345";
    await act(async () => fireEvent.change(offerInput, { target: { value: testOffer } }));

    expect(offerRadioButton).toBeChecked();
    expect(screen.queryByText("Invalid Offer")).not.toBeInTheDocument();
  });

  it('should accept UPPERCASE offer', async () => {
    renderWithMockCLNContext(providerRootProps, providerCLNProps, <CLNSend />);

    const offerRadioButton = screen.getByLabelText("Offer");
    await act(async () => fireEvent.click(offerRadioButton));

    const offerInput = screen.getByTestId("address-input");
    const testOffer = "LNO12345";
    await act(async () => fireEvent.change(offerInput, { target: { value: testOffer } }));

    expect(offerRadioButton).toBeChecked();
    expect(screen.queryByText("Invalid Offer")).not.toBeInTheDocument();
  });

});
