import { render, screen } from '@testing-library/react';
import ToggleSwitch from './ToggleSwitch';
import { Units } from '../../../utilities/constants';

describe('ToggleSwitch component ', () => {

  it('should be in the document', () => {
    render(<ToggleSwitch values={['SATS', 'BTC']} selValue={Units.SATS} storeSelector='appConfig' storeKey='unit'/>);

    expect(screen.getByTestId('toggle-switch')).toBeInTheDocument();
  });

});
