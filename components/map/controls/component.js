import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import Tooltip from 'components/tooltip';
import MapControlsSettings from './settings';

import './style.scss';

const MapControls = ({ zoom, basemap, onChangeZoom, onChangeBasemap }) => {
  return (
    <div className="c-map-controls">
      <div className="group">
        <Tooltip
          placement="left"
          content={<MapControlsSettings basemap={basemap} onChangeBasemap={onChangeBasemap} />}
        >
          <button type="button" className="btn btn-primary btn-sm">
            <Icon name="map-settings" />
          </button>
        </Tooltip>
      </div>
      <div className="group">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onChangeZoom(zoom + 1)}
        >
          <Icon name="zoom-in" />
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onChangeZoom(zoom - 1)}
        >
          <Icon name="zoom-out" />
        </button>
      </div>
    </div>
  );
};

MapControls.propTypes = {
  zoom: PropTypes.number.isRequired,
  basemap: PropTypes.string.isRequired,
  onChangeZoom: PropTypes.func.isRequired,
  onChangeBasemap: PropTypes.func.isRequired,
};

export default MapControls;
