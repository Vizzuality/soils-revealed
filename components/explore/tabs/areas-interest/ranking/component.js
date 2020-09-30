import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getFormattedValue } from 'utils/functions';
import Icon from 'components/icon';
import { Select } from 'components/forms';
import NoDataMessage from 'components/explore/no-data-message';
import { useRanking } from './helpers';

import './style.scss';

const RESULTS_PER_PAGE = 5;

const AreasInterestRanking = ({
  areaInterest,
  boundaries,
  level,
  within,
  socLayerState,
  onClickArea,
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [order, setOrder] = useState('asc');
  const [aggregation, setAggregation] = useState('average');

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
    boundaries,
    depthIndex,
    level,
    order,
    aggregation,
    socLayerState.scenario,
    within
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

  // When the SOC layer's type option or the boundaries layer change, we need to reset the ranking
  // to the first page
  useEffect(() => {
    setPageIndex(0);
  }, [boundaries, socLayerState.type, setPageIndex]);

  return (
    <div className="c-areas-interest-ranking">
      {!!error && (
        <div className="alert alert-danger mt-4" role="alert">
          Unable to fetch the data.
        </div>
      )}
      {!error && !!results && results.length === 0 && <NoDataMessage />}
      {!error && results?.length > 0 && (
        <div className="ranking">
          <div className="d-flex mt-4 mb-3">
            <Select
              id="areas-interest-ranking"
              className="w-100"
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
            <Select
              id="areas-interest-ranking"
              className="w-100 ml-2"
              aria-label="Ranking sort order"
              options={[
                { label: 'Average change', value: 'average' },
                { label: 'Total change', value: 'total' },
              ]}
              value={aggregation}
              onChange={({ value }) => {
                setPageIndex(0);
                setAggregation(value);
              }}
            />
          </div>
          {pageResults.map((result, index) => {
            const { unit, value } = getFormattedValue(
              result.value,
              socLayerState.id,
              socLayerState.type,
              aggregation === 'average' ? 'ranking-avg' : 'ranking-total'
            );

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
                <div className="col-5 text-right">
                  {value} {unit}
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
  boundaries: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  within: PropTypes.number,
  socLayerState: PropTypes.object.isRequired,
  onClickArea: PropTypes.func.isRequired,
};

AreasInterestRanking.defaultProps = {
  areaInterest: null,
  within: null,
};

export default AreasInterestRanking;
