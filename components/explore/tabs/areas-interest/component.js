import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';

import './style.scss';

const ExploreAreasInterestTab = ({ onClose }) => (
  <div className="c-explore-areas-interest-tab">
    <button type="button" className="btn btn-outline-primary close-button" onClick={onClose}>
      <Icon name="close" />
    </button>
    <h3>Areas of interest</h3>
    <div className="alert alert-primary" role="alert">
      Coming soon!
      <br />
      This feature is currently under development.
    </div>
  </div>
);

ExploreAreasInterestTab.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ExploreAreasInterestTab;
