import { render, screen } from '@testing-library/react';
import DateBox from './DateBox';
import { mockInvoice } from '../../../utilities/test-utilities';
import { convertIntoDateFormat } from '../../../utilities/data-formatters';

describe('DateBox component ', () => {

  it('format date', () => {
    render(<DateBox dataValue={mockInvoice.expires_at} dataType={'Created At'} showTooltip={false} />);
    const overlayTrigger = screen.getByTestId('overlay-trigger');
    expect(overlayTrigger).toHaveTextContent(convertIntoDateFormat(mockInvoice.expires_at));
  });

});
