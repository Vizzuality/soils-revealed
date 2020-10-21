import React, { useRef, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { logEvent } from 'utils/analytics';
import Icon from 'components/icon';
import Tooltip from 'components/tooltip';
import LayersTab from './layers';
import AreasInterestTab from './areas-interest';

import './style.scss';

const ExploreTabs = ({ showTour, areaInterest, updateAreaInterest, onClickInfo }) => {
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
  const previousAreasInterest = useRef(areaInterest);

  useEffect(() => {
    if (areaInterest !== previousAreasInterest.current) {
      if (areaInterest) {
        setAreasInterestTooltipVisible(true);
        setLayersTooltipVisible(false);
      }

      previousAreasInterest.current = areaInterest;
    }
  }, [areaInterest]);

  // When the user stops drawing, this component is mounted again so the areas of interest tooltip
  // must be opened again if the user was analizing
  // Ideally, the useState should be set to true instead of relying on a useEffect, but rootOffset
  // must be computed first to properly position the tooltip
  useEffect(() => {
    if (areaInterest) {
      setAreasInterestTooltipVisible(true);
    }
  }, [areaInterest, setAreasInterestTooltipVisible]);

  return (
    <>
      {layersTooltipVisible && (
        <div className="c-explore-tabs-backdrop" onClick={() => setLayersTooltipVisible(false)} />
      )}
      {areasInterestTooltipVisible && !areaInterest && (
        <div
          className="c-explore-tabs-backdrop"
          onClick={() => setAreasInterestTooltipVisible(false)}
        />
      )}
      <div
        className="c-explore-tabs js-explore-tabs"
        // The width is needed by the ExploreTour component
        style={{ width: `${areasBtnWidth + layersBtnWidth}px` }}
        ref={rootRef}
      >
        {/* The width on this div is necessary to fix a bug in Safari where the button would have
        a margin on its right when this component would re-render (typipally when clicking a ranking
        item) */}
        <div style={areasBtnWidth !== 0 ? { width: `${areasBtnWidth}px` } : undefined}>
          <Tooltip
            trigger="manual"
            placement="bottom-start"
            visible={areasInterestTooltipVisible}
            hideOnClick={false}
            offset={`${!areaInterest ? 0 : -rootOffset}, 7`}
            duration={0}
            content={
              <AreasInterestTab
                onClose={() => {
                  setAreasInterestTooltipVisible(false);
                  updateAreaInterest(null);
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
                logEvent('Areas of interest', 'Clicks on "areas of interest" button');

                if (!areasInterestTooltipVisible) setLayersTooltipVisible(false);
                setAreasInterestTooltipVisible(true);
              }}
            >
              <Icon name="pin" />
              Areas of interest
            </button>
          </Tooltip>
        </div>
        <div>
          <Tooltip
            trigger="manual"
            placement="bottom-start"
            visible={layersTooltipVisible}
            hideOnClick={false}
            offset={`-${areasBtnWidth}, 7`}
            duration={0}
            content={
              <LayersTab onClickInfo={onClickInfo} onClose={() => setLayersTooltipVisible(false)} />
            }
          >
            <button
              ref={layersBtnRef}
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                logEvent('Map layers', 'clicks on "map layers"');

                if (!layersTooltipVisible) {
                  setAreasInterestTooltipVisible(false);
                  updateAreaInterest(null);
                }
                setLayersTooltipVisible(true);
              }}
            >
              <Icon name="layers" />
              Map layers
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

ExploreTabs.propTypes = {
  showTour: PropTypes.bool.isRequired,
  areaInterest: PropTypes.object,
  updateAreaInterest: PropTypes.func.isRequired,
  onClickInfo: PropTypes.func.isRequired,
};

ExploreTabs.defaultProps = {
  areaInterest: null,
};

export default ExploreTabs;
