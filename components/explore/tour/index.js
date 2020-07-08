import { connect } from 'react-redux';

import { exploreSelectors, exploreActions, mapActions, mapSelectors } from 'modules/explore';
import Component from './component';

const mapStateToProps = state => ({
  showTour: exploreSelectors.selectShowTour(state),
  activeLayers: mapSelectors.selectActiveDataLayers(state),
});

const mapDispatchToProps = {
  updateShowTour: exploreActions.updateShowTour,
  updateActiveLayers: mapActions.updateActiveLayers,
  updateLayer: mapActions.updateLayer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
