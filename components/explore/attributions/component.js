import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';

import './style.scss';

const Attributions = ({ basemap, attributions }) => {
  const invert = basemap === 'dark' || basemap === 'satellite' || basemap === 'landsat';

  return (
    <div className={['c-explore-attributions', ...(invert ? ['-invert'] : [])].join(' ')}>
      <a
        href="https://www.mapbox.com/about/maps/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Mapbox"
      >
        <Icon name="mapbox" />
      </a>
      <span dangerouslySetInnerHTML={{ __html: attributions }} />
    </div>
  );
};

Attributions.propTypes = {
  basemap: PropTypes.string.isRequired,
  attributions: PropTypes.string.isRequired,
};

export default Attributions;
