import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Tooltip from 'components/tooltip';
import Icon from 'components/icon';

import './style.scss';

const HintButton = ({ icon, size, className, onClick, disabled, children, ...rest }) => (
  <Tooltip
    trigger="mouseenter focus"
    content={children}
    className={classnames('c-hint-button-tooltip', `-${size}`)}
    {...rest}
  >
    <button
      type="button"
      className={classnames({
        btn: true,
        'c-hint-button': true,
        ...(className ? { [className]: true } : {}),
      })}
      disabled={disabled}
      onClick={onClick}
      aria-label="Info"
    >
      <Icon name={icon} />
    </button>
  </Tooltip>
);

HintButton.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['inline', 'large']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

HintButton.defaultProps = {
  size: 'inline',
  className: null,
  onClick: () => null,
  disabled: false,
};

export default HintButton;
