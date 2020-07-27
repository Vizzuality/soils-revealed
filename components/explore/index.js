import { connect } from 'react-redux';

import {
  exploreSelectors,
  mapSelectors,
  exploreActions,
  mapActions,
  analysisSelectors,
} from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    zoom: mapSelectors.selectZoom(state),
    acceptableMinZoom: mapSelectors.selectAcceptableMinZoom(state),
    acceptableMaxZoom: mapSelectors.selectAcceptableMaxZoom(state),
    viewport: mapSelectors.selectViewport(state),
    basemap: mapSelectors.selectBasemap(state),
    basemapParams: mapSelectors.selectBasemapParams(state),
    roads: mapSelectors.selectRoads(state),
    labels: mapSelectors.selectLabels(state),
    featureStates: exploreSelectors.selectFeatureStates(state),
    activeDataLayers: mapSelectors.selectActiveDataLayers(state),
    activeLayersDef: mapSelectors.selectActiveLayersDef(state),
    activeLayersInteractiveIds: mapSelectors.selectActiveLayersInteractiveIds(state),
    serializedState: exploreSelectors.selectSerializedState(state),
    legendDataLayers: mapSelectors.selectLegendDataLayers(state),
    drawing: analysisSelectors.selectDrawing(state),
  }),
  {
    restoreState: exploreActions.restoreState,
    updateZoom: mapActions.updateZoom,
    updateViewport: mapActions.updateViewport,
    updateBasemap: mapActions.updateBasemap,
    updateBasemapParams: mapActions.updateBasemapParams,
    updateRoads: mapActions.updateRoads,
    updateLabels: mapActions.updateLabels,
    removeLayer: mapActions.removeLayer,
    updateLayer: mapActions.updateLayer,
    updateLayerOrder: mapActions.updateLayerOrder,
  }
)(Component);
