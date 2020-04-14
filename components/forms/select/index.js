import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Select = ({
  options,
  defaultValue,
  value,
  onChange,
  disabled,
  'aria-label': ariaLabel,
  className,
}) => {
  const onChangeSelect = useCallback(
    e => {
      const option = options.find(option => option.value === e.target.selectedOptions[0].value);
      onChange(option);
    },
    [options, onChange]
  );

  return (
    <select
      className={['c-select', 'custom-select', ...(className ? [className] : [])].join(' ')}
      disabled={disabled}
      aria-label={ariaLabel}
      defaultValue={defaultValue}
      value={value}
      onChange={onChangeSelect}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  'aria-label': PropTypes.string.isRequired,
  className: PropTypes.string,
};

Select.defaultProps = {
  defaultValue: undefined,
  value: undefined,
  onChange: () => null,
  disabled: false,
  placeholder: 'Select...',
  className: undefined,
};

export default Select;
