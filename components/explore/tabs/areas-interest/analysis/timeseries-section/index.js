import { connect } from 'react-redux';

import { mapSelectors, mapActions, analysisSelectors } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    legendLayers: mapSelectors.selectLegendDataLayers(state),
    boundaries: mapSelectors.selectBoundaries(state),
    areaInterest: analysisSelectors.selectAreaInterest(state),
  }),
  {
    updateLayer: mapActions.updateLayer,
  }
)(Component);
