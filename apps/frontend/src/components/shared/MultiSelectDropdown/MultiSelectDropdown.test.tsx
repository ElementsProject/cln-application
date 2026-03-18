import { render, screen, waitFor, act } from '@testing-library/react';
import MultiSelectDropdown, { SelectOption } from './MultiSelectDropdown';

const mockOptions: SelectOption[] = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
  { value: 'opt4', label: 'Option 4' },
];

// ✅ 11+ options needed to render the search input
const manyMockOptions: SelectOption[] = [
  ...mockOptions,
  { value: 'opt5', label: 'Option 5' },
  { value: 'opt6', label: 'Option 6' },
  { value: 'opt7', label: 'Option 7' },
  { value: 'opt8', label: 'Option 8' },
  { value: 'opt9', label: 'Option 9' },
  { value: 'opt10', label: 'Option 10' },
  { value: 'opt11', label: 'Option 11' },
];

const renderComponent = (props = {}) =>
  render(
    <MultiSelectDropdown
      options={mockOptions}
      placeholder='Select...'
      {...props}
    />
  );

const renderWithSearch = (props = {}) =>
  render(
    <MultiSelectDropdown
      options={manyMockOptions}
      placeholder='Select...'
      {...props}
    />
  );

describe('MultiSelectDropdown', () => {
  describe('rendering', () => {
    it('renders placeholder when no value selected', async () => {
      renderComponent();
      expect(screen.getByText('Select...')).toBeInTheDocument();
    });

    it('renders custom placeholder', async () => {
      renderComponent({ placeholder: 'Pick items...' });
      expect(screen.getByText('Pick items...')).toBeInTheDocument();
    });

    it('renders with pre-selected values', async () => {
      renderComponent({ selectedOptions: ['opt1', 'opt2'] });
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      // opt2 overflows into +1 badge since only 1 visible label is shown
      expect(screen.getByText('+1')).toBeInTheDocument();
    });

    it('does not render dropdown list on initial render', async () => {
      renderComponent();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('renders with custom className', async () => {
      const { container } = renderComponent({ className: 'custom-class' });
      expect(container.firstChild).toHaveClass('msd-wrapper', 'custom-class');
    });

    it('renders with custom id on trigger', async () => {
      renderComponent({ id: 'test-id' });
      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'test-id');
    });
  });

  describe('open and close behaviour', () => {
    it('opens dropdown on trigger click', async () => {
      renderComponent();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes dropdown on second trigger click', async () => {
      renderComponent();
      const trigger = screen.getByRole('combobox');
      await act(async () => { trigger.click(); });
      await act(async () => { trigger.click(); });
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('closes dropdown on outside click', async () => {
      renderComponent();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      await act(async () => {
        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    });

    it('closes dropdown and clears search on outside click', async () => {
      renderWithSearch();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        const search = screen.getByPlaceholderText('Search');
        search.focus();
        Object.defineProperty(search, 'value', { writable: true, value: 'opt' });
        search.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await act(async () => {
        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });
      await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.getByPlaceholderText('Search')).toHaveValue('');
    });

    it('sets aria-expanded to true when open', async () => {
      renderComponent();
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await act(async () => {
        trigger.click();
      });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('opens on Enter key', async () => {
      renderComponent();
      await act(async () => {
        screen.getByRole('combobox').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('focuses search input after opening', async () => {
      renderWithSearch();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search')).toHaveFocus();
      }, { timeout: 200 });
    });
  });

  describe('options rendering', () => {
    it('renders all options when open', async () => {
      renderComponent();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
      expect(screen.getByText('Option 4')).toBeInTheDocument();
    });

    it('renders empty state when no options match search', async () => {
      renderWithSearch();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        const search = screen.getByPlaceholderText('Search');
        Object.defineProperty(search, 'value', { writable: true, value: 'xyz' });
        search.dispatchEvent(new Event('change', { bubbles: true }));
      });
      expect(screen.getByText('No options found')).toBeInTheDocument();
    });

    // ✅ Search input only renders when options.length > 10
    it('does not render search input when options are 10 or fewer', async () => {
      renderComponent();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
    });

    it('renders search input when options exceed 10', async () => {
      renderWithSearch();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('selects an option on click', async () => {
      const onChange = jest.fn();
      renderComponent({ onChange });
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        screen.getByRole('option', { name: /option 1/i }).click();
      });
      expect(onChange).toHaveBeenCalledWith(['opt1'], 'include');
    });

    it('selects multiple options', async () => {
      const onChange = jest.fn();
      renderComponent({ onChange });
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        screen.getByRole('option', { name: /option 1/i }).click();
      });
      await act(async () => {
        screen.getByRole('option', { name: /option 2/i }).click();
      });
      expect(onChange).toHaveBeenLastCalledWith(['opt1', 'opt2'], 'include');
    });

    it('deselects an already selected option on click', async () => {
      const onChange = jest.fn();
      renderComponent({ selectedOptions: ['opt1'], onChange });
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        screen.getByRole('option', { name: /option 1/i }).click();
      });
      expect(onChange).toHaveBeenCalledWith([], 'include');
    });

    it('marks selected options with aria-selected', async () => {
      renderComponent({ selectedOptions: ['opt1'] });
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.getByRole('option', { name: /option 1/i })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('option', { name: /option 2/i })).toHaveAttribute('aria-selected', 'false');
    });

    it('shows selected count in footer', async () => {
      renderComponent({ selectedOptions: ['opt1', 'opt2'] });
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.getByText('2 selected')).toBeInTheDocument();
    });

    // ✅ Footer always renders — count shows 0 when nothing selected
    it('shows 0 selected in footer when nothing is selected', async () => {
      renderComponent();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.getByText('0 selected')).toBeInTheDocument();
    });
  });

  describe('tags', () => {
    it('renders a tag for each selected value up to visible limit', async () => {
      renderComponent({ selectedOptions: ['opt1', 'opt2'] });
      // Only first label visible, second overflows to +1
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('+1')).toBeInTheDocument();
    });

    it('removes tag on tag remove button click', async () => {
      const onChange = jest.fn();
      renderComponent({ selectedOptions: ['opt1', 'opt2'], onChange });
      await act(async () => {
        screen.getByLabelText('Remove Option 1').click();
      });
      expect(onChange).toHaveBeenCalledWith(['opt2'], 'include');
    });

    it('does not toggle dropdown when removing a tag', async () => {
      renderComponent({ selectedOptions: ['opt1'] });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      await act(async () => {
        screen.getByLabelText('Remove Option 1').click();
      });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('clear all', () => {
    it('renders clear button when selections exist', async () => {
      renderComponent({ selectedOptions: ['opt1'] });
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.getByTestId('footer-btn-clear-all')).toBeInTheDocument();
    });

    it('does not render clear button when nothing selected', async () => {
      renderComponent();
      expect(screen.queryByTestId('footer-btn-clear-all')).not.toBeInTheDocument();
    });

    it('clears all selections on clear button click', async () => {
      const onChange = jest.fn();
      renderComponent({ selectedOptions: ['opt1', 'opt2'], onChange });
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        screen.getByTestId('footer-btn-clear-all').click();
      });
      expect(onChange).toHaveBeenCalledWith([], 'include');
    });

    it('clears all via footer Clear All button', async () => {
      const onChange = jest.fn();
      renderComponent({ selectedOptions: ['opt1', 'opt2'], onChange });
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        screen.getByText('Clear All').click();
      });
      expect(onChange).toHaveBeenCalledWith([], 'include');
    });
  });

  describe('search', () => {
    it('renders search input when open and options exceed 10', async () => {
      renderWithSearch();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    it('filters options by search query', async () => {
      renderWithSearch();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        const search = screen.getByPlaceholderText('Search');
        Object.defineProperty(search, 'value', { writable: true, value: 'Option 1' });
        search.dispatchEvent(new Event('change', { bubbles: true }));
      });
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    it('is case insensitive', async () => {
      renderWithSearch();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        const search = screen.getByPlaceholderText('Search');
        Object.defineProperty(search, 'value', { writable: true, value: 'option 1' });
        search.dispatchEvent(new Event('change', { bubbles: true }));
      });
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('does not close dropdown when typing in search', async () => {
      renderWithSearch();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        const search = screen.getByPlaceholderText('Search');
        Object.defineProperty(search, 'value', { writable: true, value: 'opt' });
        search.dispatchEvent(new Event('change', { bubbles: true }));
      });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('clicking search input does not toggle dropdown', async () => {
      renderWithSearch();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        screen.getByPlaceholderText('Search').click();
      });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('clears search when dropdown closes via Escape', async () => {
      renderWithSearch();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        const search = screen.getByPlaceholderText('Search');
        Object.defineProperty(search, 'value', { writable: true, value: 'opt' });
        search.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await act(async () => {
        screen.getByRole('combobox').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      });
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.getByPlaceholderText('Search')).toHaveValue('');
    });
  });

  describe('filter mode', () => {
    it('defaults to include mode', async () => {
      renderComponent();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.getByRole('radio', { name: /include/i })).toBeChecked();
      expect(screen.getByRole('radio', { name: /exclude/i })).not.toBeChecked();
    });

    it('switches to exclude mode on radio click', async () => {
      const onChange = jest.fn();
      renderComponent({ onChange });
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        screen.getByRole('radio', { name: /exclude/i }).click();
      });
      expect(onChange).toHaveBeenCalledWith([], 'exclude');
    });

    it('calls onChange with current selections and new filter mode', async () => {
      const onChange = jest.fn();
      renderComponent({ selectedOptions: ['opt1'], onChange });
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        screen.getByRole('radio', { name: /exclude/i }).click();
      });
      expect(onChange).toHaveBeenCalledWith(['opt1'], 'exclude');
    });

    it('resets filter mode to include on clear all', async () => {
      const onChange = jest.fn();
      renderComponent({ selectedOptions: ['opt1'], filterMode: 'exclude', onChange });
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      await act(async () => {
        screen.getByTestId('footer-btn-clear-all').click();
      });
      expect(onChange).toHaveBeenCalledWith([], 'include');
    });
  });

  describe('accessibility', () => {
    it('trigger has role combobox', async () => {
      renderComponent();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('listbox has aria-multiselectable true', async () => {
      renderComponent();
      await act(async () => {
        screen.getByRole('combobox').click();
      });
      expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('trigger has tabIndex 0', async () => {
      renderComponent();
      expect(screen.getByRole('combobox')).toHaveAttribute('tabindex', '0');
    });
  });
});
