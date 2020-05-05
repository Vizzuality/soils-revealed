import React, { useRef, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import Tooltip from 'components/tooltip';
import LayersTab from './layers';

import './style.scss';

const ExploreTabs = ({ onClickInfo }) => {
  const areasBtnRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const areasBtnWidth = useMemo(() => areasBtnRef.current?.offsetWidth || 0, [areasBtnRef.current]);
  const [layersTooltip, setLayersTooltip] = useState(null);
  const [layersTooltipVisible, setLayersTooltipVisible] = useState(false);

  return (
    <>
      {layersTooltipVisible && <div className="c-explore-tabs-backdrop" />}
      <div className="c-explore-tabs">
        <button ref={areasBtnRef} type="button" className="btn btn-primary btn-sm" disabled>
          <Icon name="pin" />
          Areas of interest
        </button>
        <Tooltip
          placement="bottom-start"
          offset={`-${areasBtnWidth} 0`}
          content={
            layersTooltipVisible ? (
              <LayersTab onClickInfo={onClickInfo} onClose={() => layersTooltip?.hide?.()} />
            ) : (
              <span />
            )
          }
          onCreate={tooltip => setLayersTooltip(tooltip)}
          onShow={() => setLayersTooltipVisible(true)}
          onHidden={() => setLayersTooltipVisible(false)}
        >
          <button type="button" className="btn btn-primary btn-sm">
            <Icon name="layers" />
            Map layers
          </button>
        </Tooltip>
      </div>
    </>
  );
};

ExploreTabs.propTypes = {
  onClickInfo: PropTypes.func.isRequired,
};

export default ExploreTabs;
