import React from 'react';
import PropTypes from 'prop-types';

import { LayerManager as VizzLayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';

export { fetch } from 'layer-manager';

const LayerManager = ({ map, layers, providers }) => (
  <VizzLayerManager map={map} plugin={PluginMapboxGl} providers={providers}>
    {layers.map(l => {
      return <Layer key={l.id} {...l} />;
    })}
  </VizzLayerManager>
);

LayerManager.propTypes = {
  map: PropTypes.object.isRequired,
  layers: PropTypes.array.isRequired,
  providers: PropTypes.object.isRequired,
};

export default LayerManager;
