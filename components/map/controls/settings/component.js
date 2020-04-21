import React from 'react';
import PropTypes from 'prop-types';

import { BASEMAPS } from '../../constants';

import './style.scss';

const MapControlsSettings = ({ basemap, onChangeBasemap }) => (
  <div className="c-map-controls-settings">
    <section>
      <h3>Map style</h3>
      <div className="map-styles d-flex flex-wrap justify-content-between">
        {Object.keys(BASEMAPS).map(key => (
          <div key={key}>
            <input
              type="radio"
              id={`basemap-${key}`}
              name="basemap"
              className="sr-only"
              checked={key === basemap}
              onChange={() => onChangeBasemap(key)}
            />
            <label
              htmlFor={`basemap-${key}`}
              style={{ backgroundImage: `url(${BASEMAPS[key].image})` }}
            >
              {BASEMAPS[key].label}
            </label>
          </div>
        ))}
      </div>
    </section>
  </div>
);

MapControlsSettings.propTypes = {
  basemap: PropTypes.string.isRequired,
  onChangeBasemap: PropTypes.func.isRequired,
};

export default MapControlsSettings;
