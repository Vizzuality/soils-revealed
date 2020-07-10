import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

function LoadingSpinner(props) {
  const { transparent, inner, inline, mini } = props;
  const classNames = ['c-loading-spinner'];

  if (transparent) classNames.push('-transparent');
  if (inner) classNames.push('-inner');
  if (inline) classNames.push('-inline');
  if (mini) classNames.push('-mini');

  return (
    <div className={classNames.join(' ')}>
      <svg>
        <circle
          cx={mini ? 9 : 30}
          cy={mini ? 9 : 30}
          r={mini ? 5 : 20}
          fill="none"
          strokeWidth={mini ? 2 : 3}
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  );
}

LoadingSpinner.propTypes = {
  // Set the loading background transparent
  transparent: PropTypes.bool,
  // Set the loading spinner inside a box
  inner: PropTypes.bool,
  // Make the loading spinner behave like an inline-block
  inline: PropTypes.bool,
  // Reduced size of the loading spinner
  mini: PropTypes.bool,
};

LoadingSpinner.defaultProps = {
  transparent: false,
  inner: false,
  inline: false,
  mini: false,
};

export default LoadingSpinner;
