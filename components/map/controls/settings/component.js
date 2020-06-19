import React from 'react';
import PropTypes from 'prop-types';

import { Switch, Dropdown } from 'components/forms';
import { BASEMAPS } from '../../constants';

import './style.scss';

const MapControlsSettings = ({
  basemap,
  basemapParams,
  roads,
  labels,
  onChangeBasemap,
  onChangeBasemapParams,
  onChangeRoads,
  onChangeLabels,
}) => (
  <div className="c-map-controls-settings">
    <section>
      <h3>Map style</h3>
      <div className="map-styles d-flex flex-wrap justify-content-start">
        {Object.keys(BASEMAPS).map(key => (
          <div key={key}>
            <input
              type="radio"
              id={`basemap-${key}`}
              name="basemap"
              className="sr-only"
              checked={key === basemap}
              onChange={() =>
                onChangeBasemap({
                  basemap: key,
                  ...(BASEMAPS[key].params
                    ? {
                        params: Object.keys(BASEMAPS[key].params).reduce(
                          (res, param) => ({
                            ...res,
                            [param]: BASEMAPS[key].params[param].default,
                          }),
                          {}
                        ),
                      }
                    : {}),
                })
              }
            />
            <label
              htmlFor={`basemap-${key}`}
              style={{ backgroundImage: `url(${BASEMAPS[key].image})` }}
            >
              {BASEMAPS[key].label}
              {BASEMAPS[key].params && (
                <>
                  {Object.keys(BASEMAPS[key].params).map(param => (
                    <Dropdown
                      key={param}
                      value={{
                        label:
                          key === basemap
                            ? `${basemapParams[param]}`
                            : `${BASEMAPS[key].params[param].default}`,
                        value:
                          key === basemap
                            ? basemapParams[param]
                            : BASEMAPS[key].params[param].default,
                      }}
                      options={BASEMAPS[key].params[param].values.map(value => ({
                        label: `${value}`,
                        value,
                      }))}
                      onChange={({ value }) => {
                        if (basemap !== key) {
                          onChangeBasemap({
                            basemap: key,
                            ...(BASEMAPS[key].params
                              ? {
                                  params: Object.keys(BASEMAPS[key].params).reduce(
                                    (res, paramKey) => ({
                                      ...res,
                                      [paramKey]:
                                        param === paramKey
                                          ? value
                                          : BASEMAPS[key].params[paramKey].default,
                                    }),
                                    {}
                                  ),
                                }
                              : {}),
                          });
                        } else {
                          onChangeBasemapParams({ [param]: value });
                        }
                      }}
                    />
                  ))}
                </>
              )}
            </label>
          </div>
        ))}
      </div>
    </section>
    <section>
      <h3>Other settings</h3>
      <Switch id="controls-settings-roads" checked={roads} onChange={onChangeRoads}>
        Roads
      </Switch>
      <Switch id="controls-settings-labels" checked={labels} onChange={onChangeLabels}>
        Labels
      </Switch>
    </section>
  </div>
);

MapControlsSettings.propTypes = {
  basemap: PropTypes.string.isRequired,
  basemapParams: PropTypes.object,
  roads: PropTypes.bool.isRequired,
  labels: PropTypes.bool.isRequired,
  onChangeBasemap: PropTypes.func.isRequired,
  onChangeBasemapParams: PropTypes.func.isRequired,
  onChangeRoads: PropTypes.func.isRequired,
  onChangeLabels: PropTypes.func.isRequired,
};

MapControlsSettings.defaultProps = {
  basemapProps: null,
};

export default MapControlsSettings;
