import { connect } from 'react-redux';

import { analysisSelectors, mapSelectors, mapActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    areasInterest: analysisSelectors.selectAreaInterest(state),
    legendLayers: mapSelectors.selectLegendDataLayers(state),
  }),
  {
    updateLayer: mapActions.updateLayer,
  }
)(Component);
