import { screen, fireEvent, waitFor } from '@testing-library/react';
import TerminalComponent from './TerminalComponent';
import { getMockStoreData, renderWithMockContext } from '../../../../utilities/test-utilities';
import useHttp from '../../../../utilities/test-use-http';

jest.mock('../../../../utilities/test-use-http', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('TerminalComponent', () => {
  let providerProps = JSON.parse(JSON.stringify(getMockStoreData()));
  let executeSqlMock: jest.Mock;

  beforeEach(() => {
    executeSqlMock = jest.fn().mockResolvedValue({
      data: { rows: [{ id: 1, name: 'Alice' }] },
    });

    (useHttp as jest.Mock).mockReturnValue({
      executeSql: executeSqlMock,
    });

    renderWithMockContext(<TerminalComponent />, { providerProps });
  });

  it('should render the terminal container', () => {
    const terminalContainer = screen.getByTestId('terminal-container');
    expect(terminalContainer).toBeInTheDocument();
  });

  it('should display initial placeholder in the input field', () => {
    const inputField = screen.getByPlaceholderText('Enter SQL query...');
    expect(inputField).toBeInTheDocument();
  });

  it('should update query state on input change', () => {
    const inputField = screen.getByPlaceholderText('Enter SQL query...');

    fireEvent.change(inputField, { target: { value: 'select * from bkpr_accountevents' } });

    expect(inputField).toHaveValue('select * from bkpr_accountevents');
  });

  it('should call executeSql and display result in the output area', async () => {
    const inputField = screen.getByPlaceholderText('Enter SQL query...');
    const executeButton = screen.getByText('Execute');
    const mockResponse = {
      data: {
        rows: [
          [
            68002,
            'wallet',
            'chain',
            'deposit',
            312500000000,
            0,
            'bcrt',
            1727741999,
            '802839b3d0c5073956110b9ddebd2d6d3912a23d01f7c3d620c02bcb35b50328:0',
            602,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ],
          [
            68003,
            'wallet',
            'chain',
            'withdrawal',
            0,
            312500000000,
            'bcrt',
            1727742192,
            '802839b3d0c5073956110b9ddebd2d6d3912a23d01f7c3d620c02bcb35b50328:0',
            705,
            null,
            null,
            '6b3aeca4168b1be924322b0906ad8f8068580783011e9d8dd3fc9137eaaeb241',
            null,
            null,
            null,
            null,
          ],
        ],
      },
    };

    executeSqlMock.mockResolvedValueOnce(mockResponse);

    fireEvent.change(inputField, { target: { value: 'select * from bkpr_accountevents' } });
    fireEvent.click(executeButton);

    await waitFor(() => {
      const output = screen.getByTestId('terminal-container').textContent;
      expect(output).toContain('select * from bkpr_accountevents');
      expect(output).toContain(JSON.stringify(mockResponse.data.rows, null, 2));
    });
  });

  it('should handle error and display error message in the output area', async () => {
    const inputField = screen.getByPlaceholderText('Enter SQL query...');
    const executeButton = screen.getByText('Execute');
    const mockError = new Error('Something went wrong');

    executeSqlMock.mockRejectedValueOnce(mockError);

    fireEvent.change(inputField, { target: { value: 'select * from bkpr_accountevents' } });
    fireEvent.click(executeButton);

    await waitFor(() => {
      const output = screen.getByTestId('terminal-container').textContent;
      expect(output).toContain('Error: Something went wrong');
    });
  });

  it('should open the help link when Help button is clicked', () => {
    const helpButton = screen.getByText('Help');
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    fireEvent.click(helpButton);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://docs.corelightning.org/reference/lightning-sql',
      '_blank',
    );
  });

  it('should clear the output when Clear button is clicked', async () => {
    const inputField = screen.getByPlaceholderText('Enter SQL query...');
    const executeButton = screen.getByText('Execute');
    const clearButton = screen.getByText('Clear');

    const mockResponse = {
      data: {
        rows: [
          [
            68002,
            'wallet',
            'chain',
            'deposit',
            312500000000,
            0,
            'bcrt',
            1727741999,
            '802839b3d0c5073956110b9ddebd2d6d3912a23d01f7c3d620c02bcb35b50328:0',
            602,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ],
          [
            68003,
            'wallet',
            'chain',
            'withdrawal',
            0,
            312500000000,
            'bcrt',
            1727742192,
            '802839b3d0c5073956110b9ddebd2d6d3912a23d01f7c3d620c02bcb35b50328:0',
            705,
            null,
            null,
            '6b3aeca4168b1be924322b0906ad8f8068580783011e9d8dd3fc9137eaaeb241',
            null,
            null,
            null,
            null,
          ],
        ],
      },
    };

    executeSqlMock.mockResolvedValueOnce(mockResponse);

    fireEvent.change(inputField, { target: { value: 'select * from bkpr_accountevents' } });
    fireEvent.click(executeButton);

    await waitFor(() => {
      const output = screen.getByTestId('terminal-container').textContent;
      expect(output).toContain('select * from bkpr_accountevents');
      expect(output).toContain(JSON.stringify(mockResponse.data.rows, null, 2));
    });

    fireEvent.click(clearButton);

    const outputAfterClear = screen.getByTestId('terminal-container').textContent;
    expect(outputAfterClear).not.toContain('select * from bkpr_accountevents');
  });
});
