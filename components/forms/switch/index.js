import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Switch = ({ id, disabled, checked, onChange, children, className }) => (
  <div
    className={[
      'custom-control',
      'custom-switch',
      'c-switch',
      ...(className ? [className] : []),
    ].join(' ')}
  >
    <input
      type="checkbox"
      className="custom-control-input"
      disabled={disabled}
      id={id}
      checked={checked}
      onChange={() => onChange(!checked)}
    />
    <label className="custom-control-label" htmlFor={id}>
      {children}
    </label>
  </div>
);

Switch.propTypes = {
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Switch.defaultProps = {
  disabled: false,
  checked: false,
  onChange: null,
  className: null,
};

export default Switch;
