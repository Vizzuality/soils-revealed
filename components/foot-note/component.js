import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const FootNoteComponent = ({ info }) => {
  const length = info.page.toString().length;
  return (
    <div className="c-foot-note">
      <div className="page-number">{length <= 1 ? `0${info.page}` : info.page}</div>
      <p>{info.text || null}</p>
    </div>
  );
};

FootNoteComponent.propTypes = {
  info: PropTypes.shape({
    page: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  }),
};

export default FootNoteComponent;
