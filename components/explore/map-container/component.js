import React from 'react';
import PropTypes from 'prop-types';

import Tooltip, { followCursor } from 'components/tooltip';

import './style.scss';

const MapContainer = ({ drawing, children }) => {
  const inner = <div className="c-explore-map-container">{children}</div>;

  if (drawing) {
    return (
      <Tooltip
        placement="bottom"
        visible={drawing}
        interactive={false}
        hideOnClick={false}
        arrow={false}
        followCursor={true}
        plugins={[followCursor]}
        duration={0}
        offset="0 40"
        content={
          <div className="c-explore-map-container-tooltip">
            Click to add a point, and click the first one to close the shape
          </div>
        }
      >
        {inner}
      </Tooltip>
    );
  }

  return inner;
};

MapContainer.propTypes = {
  drawing: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default MapContainer;
