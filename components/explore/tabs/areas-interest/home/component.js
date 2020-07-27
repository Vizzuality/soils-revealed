import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { getLayerExtraParams } from 'utils/map';
import { BOUNDARIES, LAYERS } from 'components/map/constants';
import { Dropdown } from 'components/forms';
import { useResults } from './helpers';
import Ranking from '../ranking';

import './style.scss';

const AreasInterestHome = ({
  socLayerState,
  boundaries,
  rankingBoundaries,
  rankingBoundariesOptions,
  comparing,
  areaInterest,
  updateBoundaries,
  updateAreaInterest,
  updateCompareAreaInterest,
  updateLayer,
  updateDrawing,
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data: results, error } = useResults(
    debouncedSearch,
    comparing ? [boundaries] : undefined
  );

  const typeOption = useMemo(
    () =>
      socLayerState.config.settings.type.options.find(
        option => option.value === socLayerState.type
      ),
    [socLayerState]
  );

  const rankingBoundariesOption = useMemo(
    () => rankingBoundariesOptions.find(option => option.value === rankingBoundaries),
    [rankingBoundariesOptions, rankingBoundaries]
  );

  /**
   * @type {(search: string) => void}
   */
  const updateSearch = useCallback(
    debounce(search => setDebouncedSearch(search), 300),
    [setDebouncedSearch]
  );

  const onClickArea = useCallback(
    result => {
      if (boundaries !== result.type) {
        updateBoundaries(result.type);
      }

      const updateFunction = comparing ? updateCompareAreaInterest : updateAreaInterest;

      updateFunction({
        id: result.id,
        name: result.name,
      });
    },
    [boundaries, comparing, updateBoundaries, updateAreaInterest, updateCompareAreaInterest]
  );

  const onChangeType = useCallback(
    type => {
      // eslint-disable-next-line no-unused-vars
      const { config, ...otherParams } = getLayerExtraParams(
        { ...LAYERS[socLayerState.id], id: socLayerState.id },
        { type }
      );
      updateLayer({ id: socLayerState.id, type, ...otherParams });
    },
    [socLayerState, updateLayer]
  );

  useEffect(() => {
    if (search.length > 0) {
      updateSearch(search);
    } else {
      setDebouncedSearch('');
    }
  }, [search, updateSearch, setDebouncedSearch]);

  return (
    <div className="c-areas-interest-home">
      <h3 className={comparing ? 'h4' : undefined}>
        {comparing ? 'Compare with areas of interest' : 'Areas of interest'}
      </h3>
      <div className="form-group mt-3">
        <input
          type="search"
          aria-label={
            comparing
              ? ` Search ${BOUNDARIES[boundaries].nounPlural}...`
              : 'Search provinces, countries, biomes...'
          }
          className="form-control"
          placeholder={
            comparing
              ? ` Search ${BOUNDARIES[boundaries].nounPlural}...`
              : 'Search provinces, countries, biomes...'
          }
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        />
        {debouncedSearch.length > 0 && !error && results?.length > 0 && (
          <div className="search-results-count">
            {results.length} result{results.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {debouncedSearch.length > 0 && !!error && (
        <div className="alert alert-danger mt-2" role="alert">
          Unable to get the results of your search.
        </div>
      )}

      {debouncedSearch.length > 0 && !error && !!results && results.length === 0 && (
        <div className="search-results">No results.</div>
      )}
      {debouncedSearch.length > 0 && !error && results?.length > 0 && (
        <div className="search-results">
          {results.map(result => (
            <div key={`${result.id}-${result.type}`} className="row">
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
              <div className="col-5">{BOUNDARIES[result.type].label}</div>
            </div>
          ))}
        </div>
      )}

      {debouncedSearch.length === 0 && (
        <>
          <div className="ranking-filters">
            {socLayerState.id === 'soc-stock' && (
              <>
                {comparing ? (
                  <strong>{typeOption.label}</strong>
                ) : (
                  <Dropdown
                    options={socLayerState.config.settings.type.options}
                    value={typeOption}
                    onChange={({ value }) => onChangeType(value)}
                  />
                )}{' '}
                Soil Organic Carbon change by{' '}
                {comparing ? (
                  <strong>{rankingBoundariesOption.label}</strong>
                ) : (
                  <Dropdown
                    options={rankingBoundariesOptions}
                    value={rankingBoundariesOption}
                    onChange={({ value }) => updateBoundaries(value)}
                  />
                )}
              </>
            )}
            {socLayerState.id !== 'soc-stock' && (
              <>
                Soil Organic Carbon{' '}
                {comparing ? (
                  <strong>{typeOption.label}</strong>
                ) : (
                  <Dropdown
                    options={socLayerState.config.settings.type.options}
                    value={typeOption}
                    onChange={({ value }) => onChangeType(value)}
                  />
                )}{' '}
                change by{' '}
                {comparing ? (
                  <strong>{rankingBoundariesOption.label}</strong>
                ) : (
                  <Dropdown
                    options={rankingBoundariesOptions}
                    value={rankingBoundariesOption}
                    onChange={({ value }) => updateBoundaries(value)}
                  />
                )}
              </>
            )}
          </div>
          <Ranking onClickArea={onClickArea} />
        </>
      )}
      <div className="drawing-container text-center">
        Or draw an area on the map
        <button
          type="button"
          className="btn btn-primary d-block mt-3 mx-auto  py-2 px-5"
          onClick={() => updateDrawing(true)}
        >
          Start drawing
        </button>
      </div>
    </div>
  );
};

AreasInterestHome.propTypes = {
  socLayerState: PropTypes.object.isRequired,
  boundaries: PropTypes.string.isRequired,
  rankingBoundaries: PropTypes.string.isRequired,
  rankingBoundariesOptions: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })
  ).isRequired,
  comparing: PropTypes.bool,
  areaInterest: PropTypes.object,
  updateBoundaries: PropTypes.func.isRequired,
  updateAreaInterest: PropTypes.func.isRequired,
  updateCompareAreaInterest: PropTypes.func.isRequired,
  updateLayer: PropTypes.func.isRequired,
  updateDrawing: PropTypes.func.isRequired,
};

AreasInterestHome.defaultProps = {
  areaInterest: null,
  comparing: false,
};

export default AreasInterestHome;
