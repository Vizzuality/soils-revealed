import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useRanking } from './helpers';

import './style.scss';

const AreasInterestRanking = ({
  boundaries,
  rankingBoundaries,
  legendLayers,
  updateBoundaries,
  updateAreaInterest,
}) => {
  const socLayerGroup = useMemo(
    () => legendLayers.find(layer => layer.id === 'soc-stock' || layer.id === 'soc-experimental'),
    [legendLayers]
  );

  const typeOption = useMemo(
    () =>
      socLayerGroup.layers[0].extraParams.config.settings.type.options.find(
        option => option.value === socLayerGroup.layers[0].extraParams.type
      ),
    [socLayerGroup]
  );

  const depthIndex = useMemo(
    () =>
      typeOption.settings.depth.options.findIndex(
        option => option.value === socLayerGroup.layers[0].extraParams.depth
      ),
    [typeOption, socLayerGroup]
  );

  const { data: results, error } = useRanking(
    socLayerGroup.id,
    socLayerGroup.layers[0].extraParams.type,
    rankingBoundaries,
    depthIndex
  );

  const onClickArea = useCallback(
    result => {
      if (boundaries !== result.type) {
        updateBoundaries(result.type);
      }
      updateAreaInterest({
        id: result.id,
        name: result.name,
      });
    },
    [boundaries, updateBoundaries, updateAreaInterest]
  );

  return (
    <div className="c-areas-interest-ranking">
      {!!error && (
        <div className="alert alert-danger mt-4" role="alert">
          Unable to fetch the data.
        </div>
      )}
      {!error && !!results && results.length === 0 && (
        <div className="ranking py-5 text-center">No data.</div>
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

            return (
              <div key={result.id} className="row">
                <div className="col-7">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => onClickArea(result)}
                  >
                    {result.name}
                  </button>
                </div>
                <div className="col-5">
                  {value} {result.years ? 'kg C/ha year' : 't C/ha'}
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
  boundaries: PropTypes.string.isRequired,
  rankingBoundaries: PropTypes.string.isRequired,
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateBoundaries: PropTypes.func.isRequired,
  updateAreaInterest: PropTypes.func.isRequired,
};

export default AreasInterestRanking;
