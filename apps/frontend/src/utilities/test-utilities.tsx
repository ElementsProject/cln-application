import { render, screen } from '@testing-library/react';
import { AppContext, AppProvider } from '../store/AppContext';

export const renderWithMockContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider value={providerProps}>{ui}</AppContext.Provider>,
    renderOptions
  );
};
