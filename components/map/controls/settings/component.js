import React from 'react';
import PropTypes from 'prop-types';

import { Switch } from 'components/forms';
import { BASEMAPS } from '../../constants';

import './style.scss';

const MapControlsSettings = ({
  basemap,
  roads,
  labels,
  onChangeBasemap,
  onChangeRoads,
  onChangeLabels,
}) => (
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
    <section>
      <h3>Other settings</h3>
      <Switch id="controls-settings-roads" checked={roads} onChange={onChangeRoads} disabled>
        Roads
      </Switch>
      <Switch id="controls-settings-labels" checked={labels} onChange={onChangeLabels} disabled>
        Labels
      </Switch>
    </section>
  </div>
);

MapControlsSettings.propTypes = {
  basemap: PropTypes.string.isRequired,
  roads: PropTypes.bool.isRequired,
  labels: PropTypes.bool.isRequired,
  onChangeBasemap: PropTypes.func.isRequired,
  onChangeRoads: PropTypes.func.isRequired,
  onChangeLabels: PropTypes.func.isRequired,
};

export default MapControlsSettings;
