import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import Home from './home';
import Analysis from './analysis';

import './style.scss';

const ExploreAreasInterestTab = ({ areasInterest, onClose, onClickInfo }) => {
  const [showCloseBtn, setShowCloseBtn] = useState(true);

  return (
    <div className="c-explore-areas-interest-tab">
      {showCloseBtn && (
        <button
          type="button"
          className="btn btn-outline-primary close-button"
          aria-label="Close"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      )}
      {!areasInterest && <Home />}
      {!!areasInterest && (
        <Analysis onClickInfo={onClickInfo} onChangeVisibilityCloseBtn={setShowCloseBtn} />
      )}
    </div>
  );
};

ExploreAreasInterestTab.propTypes = {
  areasInterest: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onClickInfo: PropTypes.func.isRequired,
};

ExploreAreasInterestTab.defaultProps = {
  areasInterest: null,
};

export default ExploreAreasInterestTab;
