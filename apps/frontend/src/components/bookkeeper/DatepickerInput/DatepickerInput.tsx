import React from 'react';
import { DropdownIcon } from '../../../svgs/DropdownIcon';
import './DatepickerInput.scss';

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
  onChange?: (date: Date | null) => void;
}

const DatepickerInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick, placeholder }, ref) => (
    <div className="datepicker-input-container">
      <input
        value={value}
        onClick={onClick}
        ref={ref}
        placeholder={placeholder}
        readOnly
        className="datepicker-input"
      />
      <DropdownIcon className="dropdown-icon"/>
    </div>
  ),
);

export default DatepickerInput;
