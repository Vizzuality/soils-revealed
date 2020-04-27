import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from 'components/tooltip';
import Icon from 'components/icon';

import './style.scss';

const InfoButton = ({ className, children }) => (
  <Tooltip trigger="mouseenter focus" content={children} className="c-info-button-tooltip">
    <button
      type="button"
      className={['btn', 'c-info-button', ...(className ? [className] : [])].join(' ')}
    >
      <Icon name="info" />
    </button>
  </Tooltip>
);

InfoButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

InfoButton.defaultProps = {
  className: null,
};

export default InfoButton;
