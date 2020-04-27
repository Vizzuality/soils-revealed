import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import { Map, LayerManager, BASEMAPS } from 'components/map';

import './style.scss';

const MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'custom-layers',
      type: 'background',
      layout: {},
      paint: {
        'background-opacity': 0,
      },
    },
  ],
};

const ExploreLayersTab = ({ basemap, bounds, basemapLayerDef, onClose }) => (
  <div className="c-explore-layers-tab">
    <button type="button" className="btn btn-outline-primary close-button" onClick={onClose}>
      <Icon name="close" />
    </button>
    <div className="sidebar">
      <h3>Add layers to the map</h3>
      <div className="alert alert-primary" role="alert">
        Coming soon!
      </div>
    </div>
    <div className="preview" style={{ backgroundColor: BASEMAPS[basemap].backgroundColor }}>
      <h3>Preview layers</h3>
      <Map mapStyle={MAP_STYLE} bounds={bounds ? { bbox: bounds, duration: 0 } : undefined}>
        {map => <LayerManager map={map} providers={{}} layers={[basemapLayerDef]} />}
      </Map>
    </div>
  </div>
);

ExploreLayersTab.propTypes = {
  basemap: PropTypes.string.isRequired,
  bounds: PropTypes.arrayOf(PropTypes.array),
  basemapLayerDef: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

ExploreLayersTab.defaultProps = {
  bounds: null,
};

export default ExploreLayersTab;
