import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { BOUNDARIES } from 'components/map/constants';
import { getViewportFromBounds, combineBounds } from 'components/map';
import Ranking from '../../ranking';

const RankingSection = ({
  areaInterest,
  boundaries,
  viewport,
  updateCompareAreaInterest,
  updateViewport,
}) => {
  const onClickArea = useCallback(
    result => {
      updateCompareAreaInterest({
        id: result.id,
        name: result.name,
        level: result.level,
        parentId: result.parentId,
        parentName: result.parentName,
        bbox: result.bbox ? result.bbox : undefined,
      });

      // We center the map and zoom on the area of interest
      if (result.bbox) {
        const boundsArr = [result.bbox];
        if (areaInterest.bbox) {
          boundsArr.push(areaInterest.bbox);
        }

        updateViewport(
          getViewportFromBounds(
            window.screen.availWidth,
            window.screen.availHeight,
            viewport,
            combineBounds(...boundsArr),
            // This formula prevents the area from being hidden below the analysis
            { padding: 0.25 * Math.min(window.screen.availWidth, window.screen.availHeight) }
          )
        );
      }
    },
    [viewport, areaInterest, updateCompareAreaInterest, updateViewport]
  );

  return (
    <section>
      <header>
        <h4>Ranking</h4>
      </header>
      <div className="chart-intro">
        Soil organic carbon change{' '}
        {boundaries.id === 'landforms' ? (
          <>
            by <strong>{areaInterest.name}</strong>
          </>
        ) : (
          <>
            by <strong>{BOUNDARIES[boundaries.id].level1Noun}</strong> in{' '}
            <strong>{areaInterest.name}</strong>
          </>
        )}
        .
      </div>
      <Ranking
        boundaries={boundaries.id}
        level={1}
        within={areaInterest.id}
        onClickArea={onClickArea}
      />
    </section>
  );
};

RankingSection.propTypes = {
  areaInterest: PropTypes.object.isRequired,
  boundaries: PropTypes.object.isRequired,
  viewport: PropTypes.object.isRequired,
  updateCompareAreaInterest: PropTypes.func.isRequired,
  updateViewport: PropTypes.func.isRequired,
};

export default RankingSection;
