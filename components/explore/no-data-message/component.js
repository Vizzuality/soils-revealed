import React from 'react';

import Icon from 'components/icon';

import './style.scss';

const NoDataMessage = () => (
  <div className="c-explore-no-data-message">
    <Icon name="no-data" />
    No data available.
  </div>
);

export default NoDataMessage;
