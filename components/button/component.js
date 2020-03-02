import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

const Button = props => {
  const { children, className, ...domProps } = props;

  return (
    <button
      type="button"
      className={classnames('c-button', {
        [className]: className,
      })}
      {...domProps}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

Button.defaultProps = {
  children: null,
  className: null,
};

export default Button;
