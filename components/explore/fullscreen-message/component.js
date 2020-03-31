import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const FullscreenMessage = ({ children }) => (
  <div className="c-explore-fullscreen-message">
    <div className="container">
      <div className="row">
        <div className="col">{children}</div>
      </div>
    </div>
  </div>
);

FullscreenMessage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FullscreenMessage;
