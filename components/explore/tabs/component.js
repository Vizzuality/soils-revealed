import React, { useRef, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import Tooltip from 'components/tooltip';
import LayersTab from './layers';
import AreasInterestTab from './areas-interest';

import './style.scss';

const ExploreTabs = ({ showTour, areasInterest, updateAreasInterest, onClickInfo }) => {
  const rootRef = useRef(null);
  const areasBtnRef = useRef(null);
  const layersBtnRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rootOffset = useMemo(() => rootRef.current?.offsetLeft || 0, [rootRef.current]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const areasBtnWidth = useMemo(() => areasBtnRef.current?.offsetWidth || 0, [
    areasBtnRef.current,
    // showTour is not used but thanks to it, we make sure the button's width is computed before
    // the tour comes to the explore tabs
    showTour,
  ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const layersBtnWidth = useMemo(() => layersBtnRef.current?.offsetWidth || 0, [
    layersBtnRef.current,
    // showTour is not used but thanks to it, we make sure the button's width is computed before
    // the tour comes to the explore tabs
    showTour,
  ]);
  const [layersTooltipVisible, setLayersTooltipVisible] = useState(false);
  const [areasInterestTooltipVisible, setAreasInterestTooltipVisible] = useState(false);
  const previousAreasInterest = useRef(areasInterest);

  useEffect(() => {
    if (areasInterest !== previousAreasInterest.current) {
      if (areasInterest) {
        setAreasInterestTooltipVisible(true);
        setLayersTooltipVisible(false);
      }

      previousAreasInterest.current = areasInterest;
    }
  }, [areasInterest]);

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
          content={
            <AreasInterestTab
              onClose={() => {
                setAreasInterestTooltipVisible(false);
                updateAreasInterest(null);
              }}
              onClickInfo={onClickInfo}
            />
          }
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
              if (!layersTooltipVisible) {
                setAreasInterestTooltipVisible(false);
                updateAreasInterest(null);
              }
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
  showTour: PropTypes.bool.isRequired,
  areasInterest: PropTypes.object,
  updateAreasInterest: PropTypes.func.isRequired,
  onClickInfo: PropTypes.func.isRequired,
};

ExploreTabs.defaultProps = {
  areasInterest: null,
};

export default ExploreTabs;
