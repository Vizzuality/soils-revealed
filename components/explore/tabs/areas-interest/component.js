import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import Analysis from './analysis';

import './style.scss';

const ExploreAreasInterestTab = ({ areasInterest, onClose, onClickInfo }) => (
  <div className="c-explore-areas-interest-tab">
    <button type="button" className="btn btn-outline-primary close-button" onClick={onClose}>
      <Icon name="close" />
    </button>
    {!areasInterest && (
      <>
        <h3>Areas of interest</h3>
        <div className="alert alert-primary" role="alert">
          Coming soon!
          <br />
          This feature is currently under development.
        </div>
      </>
    )}
    {!!areasInterest && <Analysis onClickInfo={onClickInfo} />}
  </div>
);

ExploreAreasInterestTab.propTypes = {
  areasInterest: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onClickInfo: PropTypes.func.isRequired,
};

ExploreAreasInterestTab.defaultProps = {
  areasInterest: null,
};

export default ExploreAreasInterestTab;
