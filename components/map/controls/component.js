import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import Tooltip from 'components/tooltip';
import MapControlsSettings from './settings';

import './style.scss';

const MapControls = ({
  zoom,
  acceptableMinZoom,
  acceptableMaxZoom,
  basemap,
  basemapParams,
  roads,
  labels,
  drawing,
  onChangeZoom,
  onChangeBasemap,
  onChangeBasemapParams,
  onChangeRoads,
  onChangeLabels,
  onClickHelp,
}) => {
  return (
    <div className="c-map-controls">
      <div className="group">
        <Tooltip
          placement="left"
          content={
            <MapControlsSettings
              basemap={basemap}
              basemapParams={basemapParams}
              roads={roads}
              labels={labels}
              onChangeBasemap={onChangeBasemap}
              onChangeBasemapParams={onChangeBasemapParams}
              onChangeRoads={onChangeRoads}
              onChangeLabels={onChangeLabels}
            />
          }
        >
          <button type="button" className="btn btn-primary btn-sm" aria-label="Map settings">
            <Icon name="map-settings" />
          </button>
        </Tooltip>
      </div>
      <div className="group">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onChangeZoom(Math.min(zoom + 1, acceptableMaxZoom))}
          disabled={zoom >= acceptableMaxZoom}
          aria-label="Zoom in"
        >
          <Icon name="zoom-in" />
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onChangeZoom(Math.max(zoom - 1, acceptableMinZoom))}
          disabled={zoom <= acceptableMinZoom}
          aria-label="Zoom out"
        >
          <Icon name="zoom-out" />
        </button>
      </div>
      <div className="group">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={drawing}
          onClick={onClickHelp}
          aria-label="Help"
        >
          <Icon name="help" />
        </button>
      </div>
    </div>
  );
};

MapControls.propTypes = {
  zoom: PropTypes.number.isRequired,
  acceptableMinZoom: PropTypes.number.isRequired,
  acceptableMaxZoom: PropTypes.number.isRequired,
  basemap: PropTypes.string.isRequired,
  basemapParams: PropTypes.object,
  roads: PropTypes.bool.isRequired,
  labels: PropTypes.bool.isRequired,
  drawing: PropTypes.bool.isRequired,
  onChangeZoom: PropTypes.func.isRequired,
  onChangeBasemap: PropTypes.func.isRequired,
  onChangeBasemapParams: PropTypes.func.isRequired,
  onChangeRoads: PropTypes.func.isRequired,
  onChangeLabels: PropTypes.func.isRequired,
  onClickHelp: PropTypes.func.isRequired,
};

MapControls.defaultProps = {
  basemapProps: null,
};

export default MapControls;
