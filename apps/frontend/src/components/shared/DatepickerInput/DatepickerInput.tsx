import { useRef } from 'react';
import './DatepickerInput.scss';
import DatePicker from 'react-datepicker';
import { InputGroup } from 'react-bootstrap';
import { ChevronDown } from '../../../svgs/ChevronDown';

const CLNDatePicker = (props) => {
  const datePickerRef = useRef<DatePicker>(null);

  const openDetapicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };
    
  return (
    <InputGroup>
      <DatePicker
        id={props.id}
        selected={props.selectedDate}
        onChange={props.onChangeDate}
        maxDate={props.maxDate}
        minDate={new Date(2018, 0, 1)}
        dateFormat="dd MMM, yyyy"
        ref={datePickerRef}
        placeholderText={props.placeholderText}
        className='form-control form-control-left'
      />
      <InputGroup.Text
        className="form-control-addon form-control-addon-right"
        onClick={openDetapicker}
      >
        <ChevronDown width={12} height={7} />
      </InputGroup.Text>
    </InputGroup>
  );
};

export default CLNDatePicker;
