import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { BOUNDARIES } from 'components/map/constants';
import Ranking from '../../ranking';

const RankingSection = ({ areaInterest, boundaries, updateCompareAreaInterest }) => {
  const onClickArea = useCallback(
    result => {
      updateCompareAreaInterest({
        id: result.id,
        name: result.name,
        level: result.level,
      });
    },
    [updateCompareAreaInterest]
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
            by <strong>${areaInterest.name}</strong>
          </>
        ) : (
          <>
            in <strong>{areaInterest.name}</strong> by{' '}
            <strong>{BOUNDARIES[boundaries.id].level1NounPlural}</strong>
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
  updateCompareAreaInterest: PropTypes.func.isRequired,
};

export default RankingSection;
