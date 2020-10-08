import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Icon from 'components/icon';

import './style.scss';

const Warning = ({ socLayerState, areaInterest, compareAreaInterest, className }) => {
  if (!areaInterest.geo && !compareAreaInterest?.geo) {
    return null;
  }

  return (
    <div className={classnames({ 'c-change-section-warning': true, [className]: !!className })}>
      <Icon name="warning" />
      <div className="text">
        The total change value may not be accurate if oceans
        {socLayerState.id === 'soc-experimental'
          ? ' or neighboring countries to Argentina'
          : ''}{' '}
        are included in your geometry.
      </div>
    </div>
  );
};

Warning.propTypes = {
  socLayerState: PropTypes.object.isRequired,
  areaInterest: PropTypes.object.isRequired,
  compareAreaInterest: PropTypes.object,
  className: PropTypes.string,
};

Warning.defaultProps = {
  compareAreaInterest: null,
  className: null,
};

export default Warning;
