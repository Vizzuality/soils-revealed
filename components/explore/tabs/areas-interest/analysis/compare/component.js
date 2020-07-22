import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import Home from '../../home';

import './style.scss';

const AnalysisCompare = ({ onClose }) => (
  <div className="c-analysis-compare">
    <button type="button" className="btn btn-outline-primary close-button" onClick={onClose}>
      <Icon name="close" />
    </button>
    <Home comparing />
  </div>
);

AnalysisCompare.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AnalysisCompare;
