import { connect } from 'react-redux';

import { mapSelectors } from 'modules/explore';
import Component from './component';

export default connect(() => ({
  layers: mapSelectors.selectDataLayers(),
}))(Component);
