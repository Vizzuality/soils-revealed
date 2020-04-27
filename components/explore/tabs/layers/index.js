import { connect } from 'react-redux';

import { mapSelectors } from 'modules/explore';
import Component from './component';

export default connect(state => ({
  basemap: mapSelectors.selectBasemap(state),
  viewport: mapSelectors.selectViewport(state),
  bounds: mapSelectors.selectBounds(state),
  basemapLayerDef: mapSelectors.selectBasemapLayerDef(state),
}))(Component);
