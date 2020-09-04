import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Select = ({
  id,
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
      const { value } = e.target.selectedOptions[0];

      let option;
      for (let i = 0, j = options.length; i < j; i++) {
        const currentOption = options[i];

        if (currentOption.value === value) {
          option = currentOption;
          break;
        }

        if (currentOption.options) {
          for (let k = 0, l = currentOption.options.length; k < l; k++) {
            const currentSubOption = currentOption.options[k];

            if (currentSubOption.value === value) {
              option = currentSubOption;
              break;
            }
          }
        }
      }

      onChange(option);
    },
    [options, onChange]
  );

  return (
    <select
      id={id}
      className={['c-select', 'custom-select', ...(className ? [className] : [])].join(' ')}
      disabled={disabled}
      aria-label={ariaLabel}
      defaultValue={defaultValue}
      value={value}
      onChange={onChangeSelect}
    >
      {options.map(option => (
        <Fragment key={option.value ? option.value : option.label}>
          {!option.options && (
            <option value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          )}
          {!!option.options && (
            <optgroup label={option.label}>
              {option.options.map(subOption => (
                <option key={subOption.value} value={subOption.value} disabled={subOption.disabled}>
                  {subOption.label}
                </option>
              ))}
            </optgroup>
          )}
        </Fragment>
      ))}
    </select>
  );
};

Select.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
          disabled: PropTypes.bool,
        })
      ),
      disabled: PropTypes.bool,
    })
  ).isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  'aria-label': PropTypes.string,
  className: PropTypes.string,
};

Select.defaultProps = {
  defaultValue: undefined,
  value: undefined,
  onChange: () => null,
  disabled: false,
  'aria-label': null,
  className: undefined,
};

export default Select;
