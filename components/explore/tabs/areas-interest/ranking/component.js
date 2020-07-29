import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import { Select } from 'components/forms';
import { useRanking } from './helpers';

import './style.scss';

const RESULTS_PER_PAGE = 5;

const AreasInterestRanking = ({ areaInterest, rankingBoundaries, socLayerState, onClickArea }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [order, setOrder] = useState('asc');

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
    depthIndex,
    order
  );

  const maxPageIndex = useMemo(() => {
    if (!error && results?.length > 0) {
      return (
        Math.floor(results.length / RESULTS_PER_PAGE) +
        (results.length % RESULTS_PER_PAGE !== 0 ? 1 : 0) -
        1
      );
    }

    return 0;
  }, [error, results]);

  const pageResults = useMemo(() => {
    if (!error && results?.length > 0) {
      return results.slice(pageIndex * RESULTS_PER_PAGE, (1 + pageIndex) * RESULTS_PER_PAGE);
    }

    return [];
  }, [error, results, pageIndex]);

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
          <Select
            id="areas-interest-ranking"
            className="d-block w-100 mt-4 mb-3 text-center"
            aria-label="Ranking sort order"
            options={[
              { label: 'Ascending ranking', value: 'asc' },
              { label: 'Descending ranking', value: 'desc' },
            ]}
            value={order}
            onChange={({ value }) => {
              setPageIndex(0);
              setOrder(value);
            }}
          />
          {pageResults.map((result, index) => {
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
                  <div className="rank">{pageIndex * RESULTS_PER_PAGE + index + 1}</div>
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
          <div className="control-buttons">
            <button
              type="button"
              className="btn btn-primary"
              aria-label="Previous results"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(index => index - 1)}
            >
              <Icon name="short-bottom-arrow" />
            </button>
            <button
              type="button"
              className="btn btn-primary"
              aria-label="Next results"
              disabled={pageIndex === maxPageIndex}
              onClick={() => setPageIndex(index => index + 1)}
            >
              <Icon name="short-bottom-arrow" />
            </button>
          </div>
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
