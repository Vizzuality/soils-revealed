import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const SectionTitle = ({ info, className }) => {
  const length = info.index.toString().length;
  return (
    <h2 className={`c-section-title ${className}`}>
      <div className="index">{length <= 1 ? `0${info.index}` : info.index}</div>
      {info.text || null}
    </h2>
  );
};

SectionTitle.propTypes = {
  info: PropTypes.shape({
    index: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
};

SectionTitle.defaultProps = {
  className: '',
};

export default SectionTitle;
