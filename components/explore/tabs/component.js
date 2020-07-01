import React, { useRef, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import Tooltip from 'components/tooltip';
import LayersTab from './layers';
import AreasInterestTab from './areas-interest';

import './style.scss';

const ExploreTabs = ({ onClickInfo }) => {
  const rootRef = useRef(null);
  const areasBtnRef = useRef(null);
  const layersBtnRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rootOffset = useMemo(() => rootRef.current?.offsetLeft || 0, [rootRef.current]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const areasBtnWidth = useMemo(() => areasBtnRef.current?.offsetWidth || 0, [areasBtnRef.current]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const layersBtnWidth = useMemo(() => layersBtnRef.current?.offsetWidth || 0, [
    layersBtnRef.current,
  ]);
  const [layersTooltipVisible, setLayersTooltipVisible] = useState(false);
  const [areasInterestTooltipVisible, setAreasInterestTooltipVisible] = useState(false);

  return (
    <>
      {layersTooltipVisible && (
        <div className="c-explore-tabs-backdrop" onClick={() => setLayersTooltipVisible(false)} />
      )}
      <div
        className="c-explore-tabs js-explore-tabs"
        // The width is needed by the ExploreTour component
        style={{ width: `${areasBtnWidth + layersBtnWidth}px` }}
        ref={rootRef}
      >
        <Tooltip
          trigger="manual"
          placement="bottom-start"
          visible={areasInterestTooltipVisible}
          hideOnClick={false}
          offset={`-${rootOffset} 7`}
          content={<AreasInterestTab onClose={() => setAreasInterestTooltipVisible(false)} />}
        >
          <button
            ref={areasBtnRef}
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (!areasInterestTooltipVisible) setLayersTooltipVisible(false);
              setAreasInterestTooltipVisible(visible => !visible);
            }}
          >
            <Icon name="pin" />
            Areas of interest
          </button>
        </Tooltip>
        <Tooltip
          trigger="manual"
          placement="bottom-start"
          visible={layersTooltipVisible}
          hideOnClick={false}
          offset={`-${areasBtnWidth} 7`}
          content={
            <LayersTab onClickInfo={onClickInfo} onClose={() => setLayersTooltipVisible(false)} />
          }
        >
          <button
            ref={layersBtnRef}
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (!layersTooltipVisible) setAreasInterestTooltipVisible(false);
              setLayersTooltipVisible(visible => !visible);
            }}
          >
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
