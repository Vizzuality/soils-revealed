import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

import './style.scss';

const Select = ({
  id,
  options,
  value,
  onChange,
  disabled,
  'aria-label': ariaLabel,
  className,
  overflow,
}) => {
  const selectedOption = useMemo(() => {
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

    return option;
  }, [options, value]);

  return (
    <ReactSelect
      inputId={id}
      aria-label={ariaLabel}
      options={options}
      value={selectedOption}
      onChange={onChange}
      className={['c-select', ...(className ? [className] : [])].join(' ')}
      classNamePrefix="c-select-menu"
      isDisabled={disabled}
      menuPlacement="auto"
      isSearchable={false}
      menuPosition={overflow ? 'fixed' : 'absolute'}
    />
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
          isDisabled: PropTypes.bool,
        })
      ),
      disabled: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  'aria-label': PropTypes.string,
  className: PropTypes.string,
  overflow: PropTypes.bool,
};

Select.defaultProps = {
  value: undefined,
  onChange: () => null,
  disabled: false,
  'aria-label': null,
  className: undefined,
  overflow: false,
};

export default Select;
