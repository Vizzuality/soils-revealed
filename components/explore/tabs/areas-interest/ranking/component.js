import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useRanking } from './helpers';

import './style.scss';

const AreasInterestRanking = ({ areaInterest, rankingBoundaries, socLayerState, onClickArea }) => {
  const typeOption = useMemo(
    () =>
      socLayerState.config.settings.type.options.find(
        option => option.value === socLayerState.type
      ),
    [socLayerState]
  );

  const depthIndex = useMemo(
    () =>
      typeOption.settings.depth.options.findIndex(option => option.value === socLayerState.depth),
    [typeOption, socLayerState]
  );

  const { data: results, error } = useRanking(
    socLayerState.id,
    socLayerState.type,
    rankingBoundaries,
    depthIndex
  );

  return (
    <div className="c-areas-interest-ranking">
      {!!error && (
        <div className="alert alert-danger mt-4" role="alert">
          Unable to fetch the data.
        </div>
      )}
      {!error && !!results && results.length === 0 && (
        <div className="ranking py-5 text-center">No data available.</div>
      )}
      {!error && results?.length > 0 && (
        <div className="ranking">
          {results.map(result => {
            let value = result.value;
            if (result.years) {
              value /= result.years[1] - result.years[0] + 1;
              value *= 1000;
            }
            value = Math.round(value * 10) / 10;

            let unit = 't C/ha';
            if (socLayerState.id === 'soc-experimental' && socLayerState.type === 'concentration') {
              if (result.years) {
                unit = 'mg C/kg';
              } else {
                unit = 'g C/kg';
              }
            } else {
              if (result.years) {
                unit = 'kg C/ha';
              }
            }

            return (
              <div key={result.id} className="row">
                <div className="col-7">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => onClickArea(result)}
                    disabled={result.id === areaInterest?.id}
                  >
                    {result.name}
                  </button>
                </div>
                <div className="col-5">
                  {value} {result.years ? `${unit} year` : unit}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

AreasInterestRanking.propTypes = {
  areaInterest: PropTypes.object,
  rankingBoundaries: PropTypes.string.isRequired,
  socLayerState: PropTypes.object.isRequired,
  onClickArea: PropTypes.func.isRequired,
};

AreasInterestRanking.defaultProps = {
  areaInterest: null,
};

export default AreasInterestRanking;
