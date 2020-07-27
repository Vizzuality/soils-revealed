import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const DrawBoard = ({ updateDrawing }) => {
  return (
    <div className="c-explore-drawing-board">
      <div className="background" />
      <button
        type="button"
        className="btn btn-light btn-primary d-block mt-4 mx-auto  py-2 px-5"
        onClick={() => updateDrawing(false)}
      >
        Cancel
      </button>
    </div>
  );
};

DrawBoard.propTypes = {
  updateDrawing: PropTypes.func.isRequired,
};

export default DrawBoard;
