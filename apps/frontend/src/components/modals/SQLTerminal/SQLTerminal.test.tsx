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
    expect(screen.getByTestId('terminal-container')).toBeInTheDocument();
  });

  it('should display initial placeholder in the input field', async () => {
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    expect(screen.getByTestId('query-input')).toBeInTheDocument();
  });

  it('should update query state on input change', async () => {
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    const inputField = screen.getByTestId('query-input');
    fireEvent.change(inputField, { target: { value: 'select * from bkpr_accountevents' } });
    expect(inputField).toHaveValue('select * from bkpr_accountevents');
  });

  it('should call executeSql and display result as table by default', async () => {
    spyOnExecuteSql();
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    const inputField = screen.getByTestId('query-input');
    fireEvent.change(inputField, { target: { value: 'select * from bkpr_accountevents' } });
    fireEvent.click(screen.getByText('Execute'));
    await waitFor(() => {
      expect(screen.getByTestId('terminal-container').querySelector('.sql-table')).toBeInTheDocument();
    });
  });

  it('should display result as JSON when switched to JSON view', async () => {
    spyOnExecuteSql();
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    const inputField = screen.getByTestId('query-input');
    fireEvent.change(inputField, { target: { value: 'select * from bkpr_accountevents' } });
    fireEvent.click(screen.getByText('Execute'));
    await waitFor(() => {
      expect(screen.getByTestId('terminal-container').querySelector('.sql-table')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('toggle-switch'));
    await waitFor(() => {
      const output = screen.getByTestId('terminal-container').textContent;
      expect(output).toContain(JSON.stringify(mockSQLResponse.rows, null, 2));
    });
  });

  it('should handle error and display error message in the output area', async () => {
    spyOnExecuteSql();
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    const inputField = screen.getByTestId('query-input');
    fireEvent.change(inputField, { target: { value: 'select * from non_existing_table' } });
    fireEvent.click(screen.getByText('Execute'));
    await waitFor(() => {
      const output = screen.getByTestId('terminal-container').textContent;
      expect(output).not.toContain(JSON.stringify(mockSQLResponse.rows, null, 2));
    });
  });

  it('should open the help link when Help button is clicked', async () => {
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    fireEvent.click(screen.getByText('Help'));
    expect(windowOpenSpy).toHaveBeenCalledWith('https://docs.corelightning.org/reference/sql', '_blank');
  });

  it('should clear the query and output when Clear button is clicked', async () => {
    spyOnExecuteSql();
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    const inputField = screen.getByTestId('query-input');
    fireEvent.change(inputField, { target: { value: 'select * from bkpr_accountevents' } });
    fireEvent.click(screen.getByText('Execute'));
    await waitFor(() => {
      expect(screen.getByTestId('terminal-container').querySelector('.sql-table')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Clear'));
    await waitFor(() => {
      expect(screen.getByTestId('query-input')).toHaveValue('');
      expect(screen.getByTestId('terminal-container').querySelector('.sql-table')).not.toBeInTheDocument();
    });
  });

  it('should reset to Table view when Clear button is clicked', async () => {
    spyOnExecuteSql();
    await renderWithProviders(<SQLTerminal />, { preloadedState: customMockStore });
    const inputField = screen.getByTestId('query-input');
    fireEvent.change(inputField, { target: { value: 'select * from bkpr_accountevents' } });
    fireEvent.click(screen.getByText('Execute'));
    await waitFor(() => {
      expect(screen.getByTestId('terminal-container').querySelector('.sql-table')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('toggle-switch'));
    await waitFor(() => {
      expect(screen.getByTestId('terminal-container').querySelector('.sql-table')).not.toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Clear'));
    fireEvent.change(inputField, { target: { value: 'select * from bkpr_accountevents' } });
    fireEvent.click(screen.getByText('Execute'));
    await waitFor(() => {
      expect(screen.getByTestId('terminal-container').querySelector('.sql-table')).toBeInTheDocument();
    });
  });
});
