import { connect } from 'react-redux';

import { mapSelectors, mapActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    basemap: mapSelectors.selectBasemap(state),
    activeLayers: mapSelectors.selectActiveDataLayers(state),
    layersByGroup: mapSelectors.selectDataLayersByGroup(state),
  }),
  {
    updateActiveLayers: mapActions.updateActiveLayers,
  }
)(Component);
