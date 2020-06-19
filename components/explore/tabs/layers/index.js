import { connect } from 'react-redux';

import { mapSelectors, mapActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    basemap: mapSelectors.selectBasemap(state),
    viewport: mapSelectors.selectViewport(state),
    bounds: mapSelectors.selectBounds(state),
    boundaries: mapSelectors.selectBoundaries(state),
    basemapLayerDef: mapSelectors.selectBasemapLayerDef(state),
    layersByGroup: mapSelectors.selectDataLayersByGroup(state),
    layers: mapSelectors.selectDataLayers(),
    activeLayers: mapSelectors.selectActiveDataLayers(state),
  }),
  {
    updateBoundaries: mapActions.updateBoundaries,
    updateActiveLayers: mapActions.updateActiveLayers,
  }
)(Component);
