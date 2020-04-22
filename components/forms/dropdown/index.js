import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

import './style.scss';

const Container = ({ open, target, onClose, children }) => (
  <div className="wrapper">
    {target}
    {open && (
      <>
        <div role="menu" className="menu">
          {children}
        </div>
        <div className="backdrop" onClick={onClose} />
      </>
    )}
  </div>
);

Container.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  target: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Dropdown = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const onChangeCallback = useCallback(
    (...params) => {
      setOpen(false);
      onChange(...params);
    },
    [setOpen, onChange]
  );

  return (
    <div className="c-dropdown">
      <Container
        open={open}
        onClose={() => setOpen(false)}
        target={
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-haspopup
            className="target-button"
          >
            {value.label}
          </button>
        }
      >
        <ReactSelect
          autoFocus
          isSearchable={false}
          backspaceRemovesValue={false}
          controlShouldRenderValue={false}
          hideSelectedOptions={false}
          isClearable={false}
          tabSelectsValue={false}
          menuIsOpen
          options={options}
          onChange={onChangeCallback}
          value={value}
          components={{ DropdownIndicator: null, IndicatorSeparator: null }}
          classNamePrefix="menu"
        />
      </Container>
    </div>
  );
};

const optionType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
});

Dropdown.propTypes = {
  options: PropTypes.arrayOf(optionType).isRequired,
  value: optionType.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Dropdown;
