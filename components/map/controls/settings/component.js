import React from 'react';
import PropTypes from 'prop-types';

import { Radio, Switch } from 'components/forms';
import { BOUNDARIES, BASEMAPS } from '../../constants';

import './style.scss';

const MapControlsSettings = ({
  basemap,
  roads,
  labels,
  boundaries,
  onChangeBasemap,
  onChangeRoads,
  onChangeLabels,
  onChangeBoundaries,
}) => (
  <div className="c-map-controls-settings">
    <section>
      <h3>Type of map</h3>
      {Object.keys(BOUNDARIES).map(key => (
        <Radio
          key={key}
          id={`boundaries-${key}`}
          name="boundaries"
          checked={key === boundaries}
          onChange={() => onChangeBoundaries(key)}
          disabled
        >
          {BOUNDARIES[key].label}
        </Radio>
      ))}
    </section>
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
  boundaries: PropTypes.string.isRequired,
  onChangeBasemap: PropTypes.func.isRequired,
  onChangeRoads: PropTypes.func.isRequired,
  onChangeLabels: PropTypes.func.isRequired,
  onChangeBoundaries: PropTypes.func.isRequired,
};

export default MapControlsSettings;
