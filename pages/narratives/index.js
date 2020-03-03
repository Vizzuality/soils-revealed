import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = ({ routes }) => ({
  activeTab: routes.query.tab,
});

export default connect(mapStateToProps)(Component);
