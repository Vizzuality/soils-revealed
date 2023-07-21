import React from 'react';
import PropTypes from 'prop-types';

import Tooltip, { followCursor } from 'components/tooltip';
import Icon from 'components/icon';

import './style.scss';

const MapContainer = ({ drawing, drawingState, children }) => {
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
        offset="0, 40"
        content={
          <div className="c-explore-map-container-tooltip">
            {drawingState === 'drawing' &&
              'Click to add a point and close the shape to analyze it.'}
            {drawingState === 'error' && (
              <>
                <Icon name="warning" className="d-block mx-auto mb-2" />
                <p>
                  The drawn area is either too small ({'<'} 1 km²) or too big ({'>'} 100k km²).
                </p>
                <p className="mb-0">Click to start a new one.</p>
              </>
            )}
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
  drawingState: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default MapContainer;
