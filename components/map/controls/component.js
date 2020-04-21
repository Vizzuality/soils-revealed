import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';

import './style.scss';

const MapControls = ({ zoom, updateZoom }) => {
  return (
    <div className="c-map-controls">
      <div className="group">
        <button type="button" className="btn btn-primary btn-sm" disabled>
          <Icon name="map-settings" />
        </button>
      </div>
      <div className="group">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => updateZoom(zoom + 1)}
        >
          <Icon name="zoom-in" />
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => updateZoom(zoom - 1)}
        >
          <Icon name="zoom-out" />
        </button>
      </div>
    </div>
  );
};

MapControls.propTypes = {
  zoom: PropTypes.number.isRequired,
  updateZoom: PropTypes.func.isRequired,
};

export default MapControls;
