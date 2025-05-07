import { screen, fireEvent, waitFor } from '@testing-library/react';
import SQLTerminal from './SQLTerminal';
import { renderWithProviders } from '../../../utilities/test-utilities/mockStore';
import { mockBKPRStoreData, mockCLNStoreData, mockRootStoreData, mockShowModals, mockSQLResponse } from '../../../utilities/test-utilities/mockData';
import { spyOnExecuteSql } from '../../../utilities/test-utilities/mockService';

describe('SQLTerminal', () => {
  const customMockStore = {
    root: {
      ...mockRootStoreData,
      showModals: {
        ...mockShowModals,
        sqlTerminalModal: true,
      },
    },
    cln: mockCLNStoreData,
    bkpr: mockBKPRStoreData
  };
  it('should be in the document', async () => {
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    expect(screen.getByTestId('terminal-container')).not.toBeEmptyDOMElement();
  });

  it('should render the terminal container', async () => {
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    const terminalContainer = screen.getByTestId('terminal-container');
    expect(terminalContainer).toBeInTheDocument();
  });

  it('should display initial placeholder in the input field', async () => {
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    const inputField = screen.getByTestId('query-input');
    expect(inputField).toBeInTheDocument();
  });

  it('should update query state on input change', async () => {
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    const inputField = screen.getByTestId('query-input');
    fireEvent.change(inputField, { target: { value: 'select * from bkpr_accountevents' } });
    expect(inputField).toHaveValue('select * from bkpr_accountevents');
  });

  it('should call executeSql and display result in the output area', async () => {
    spyOnExecuteSql();
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    const inputField = screen.getByTestId('query-input');
    const executeButton = screen.getByText('Execute');
    fireEvent.change(inputField, { target: { value: 'select * from bkpr_accountevents' } });
    fireEvent.click(executeButton);
    await waitFor(() => {
      const output = screen.getByTestId('terminal-container').textContent;
      expect(output).toContain('select * from bkpr_accountevents');
      expect(output).toContain(JSON.stringify(mockSQLResponse.rows, null, 2));
    });
  });

  it('should handle error and display error message in the output area', async () => {
    spyOnExecuteSql();
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    const inputField = screen.getByTestId('query-input');
    const executeButton = screen.getByText('Execute');
    fireEvent.change(inputField, { target: { value: 'select * from non_existing_table' } });
    fireEvent.click(executeButton);
    await waitFor(() => {
      const output = screen.getByTestId('terminal-container').textContent;
      expect(output).not.toContain(JSON.stringify(mockSQLResponse.rows, null, 2));
    });
  });

  it('should open the help link when Help button is clicked', async () => {
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });    
    const helpButton = screen.getByText('Help');
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    fireEvent.click(helpButton);
    expect(windowOpenSpy).toHaveBeenCalledWith('https://docs.corelightning.org/reference/sql', '_blank');
  });

  it('should clear the output when Clear button is clicked', async () => {
    spyOnExecuteSql();
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    const inputField = screen.getByTestId('query-input');
    const executeButton = screen.getByText('Execute');
    const clearButton = screen.getByText('Clear');
    fireEvent.change(inputField, { target: { value: 'select * from bkpr_accountevents' } });
    fireEvent.click(executeButton);
    await waitFor(() => {
      const output = screen.getByTestId('terminal-container').textContent;
      expect(output).toContain('select * from bkpr_accountevents');
      expect(output).toContain(JSON.stringify(mockSQLResponse.rows, null, 2));
    });
    fireEvent.click(clearButton);

    const outputAfterClear = screen.getByTestId('terminal-container').textContent;
    expect(outputAfterClear).not.toContain('select * from bkpr_accountevents');
  });
});
