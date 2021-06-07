import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Radio = ({ id, name, disabled, checked, onChange, children, className, required }) => (
  <div
    className={[
      'custom-control',
      'custom-radio',
      'c-radio',
      ...(className ? [className] : []),
    ].join(' ')}
  >
    <input
      type="radio"
      className="custom-control-input"
      disabled={disabled}
      id={id}
      name={name}
      checked={checked}
      onChange={onChange}
      required={required}
    />
    <label className="custom-control-label" htmlFor={id}>
      {children}
    </label>
  </div>
);

Radio.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
};

Radio.defaultProps = {
  disabled: false,
  checked: false,
  onChange: null,
  className: null,
  required: false,
};

export default Radio;
