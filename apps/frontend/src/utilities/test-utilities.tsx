import { render } from '@testing-library/react';
import { AppContext } from '../store/AppContext';

export const renderWithMockContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider value={providerProps}>{ui}</AppContext.Provider>,
    renderOptions
  );
};
