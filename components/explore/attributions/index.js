import { connect } from 'react-redux';

import { mapSelectors } from 'modules/explore';
import Component from './component';

export default connect(state => ({
  basemap: mapSelectors.selectBasemap(state),
  attributions: mapSelectors.selectAttributions(state),
}))(Component);
