import { act, fireEvent, screen } from '@testing-library/react';
import CLNSend from './CLNSend';
import { getMockStoreData, renderWithMockContext } from '../../../utilities/test-utilities';

describe('CLNSend component ', () => {
  let providerProps;
  beforeEach(() => providerProps = JSON.parse(JSON.stringify(getMockStoreData())));

  it('should be in the document', () => {
    renderWithMockContext(<CLNSend />, { providerProps });
    expect(screen.getByTestId('cln-send')).toBeInTheDocument();
  });

  it('should accept lowercase invoice', async () => {
    renderWithMockContext(<CLNSend />, { providerProps });

    const invoiceInput = screen.getByTestId("address-input");
    const testInvoice = 'lnb12345';
    await act(async () => fireEvent.change(invoiceInput, { target: { value: testInvoice } }));

    expect(screen.queryByText('Invalid Invoice')).not.toBeInTheDocument();
  });
  
  it('should accept UPPERCASE invoice', async () => {
    renderWithMockContext(<CLNSend />, { providerProps });

    const invoiceInput = screen.getByTestId("address-input");
    const testInvoice = "LNB12345";
    await act(async () => fireEvent.change(invoiceInput, { target: { value: testInvoice } }));

    expect(screen.queryByText("Invalid Invoice")).not.toBeInTheDocument();
  });

  it('should accept lowercase offer', async () => {
    renderWithMockContext(<CLNSend />, { providerProps });

    const offerRadioButton = screen.getByLabelText("Offer");
    await act(async () => fireEvent.click(offerRadioButton));

    const offerInput = screen.getByTestId("address-input");
    const testOffer = "lno12345";
    await act(async () => fireEvent.change(offerInput, { target: { value: testOffer } }));

    expect(offerRadioButton).toBeChecked();
    expect(screen.queryByText("Invalid Offer")).not.toBeInTheDocument();
  });

  it('should accept UPPERCASE offer', async () => {
    renderWithMockContext(<CLNSend />, { providerProps });

    const offerRadioButton = screen.getByLabelText("Offer");
    await act(async () => fireEvent.click(offerRadioButton));

    const offerInput = screen.getByTestId("address-input");
    const testOffer = "LNO12345";
    await act(async () => fireEvent.change(offerInput, { target: { value: testOffer } }));

    expect(offerRadioButton).toBeChecked();
    expect(screen.queryByText("Invalid Offer")).not.toBeInTheDocument();
  });

});
