import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = ({ routes }) => ({
  pathname: routes.pathname,
});

export default connect(mapStateToProps)(Component);
