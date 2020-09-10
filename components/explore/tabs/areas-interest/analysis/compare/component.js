import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import Icon from 'components/icon';
import { Dropdown } from 'components/forms';
import { BOUNDARIES } from 'components/map/constants';
import { getViewportFromBounds, combineBounds } from 'components/map';
import Ranking from '../../ranking';
import { useResults } from './helpers';

import './style.scss';

const AnalysisCompare = ({
  boundaries,
  areaInterest,
  socLayerState,
  viewport,
  updateCompareAreaInterest,
  updateDrawing,
  onClose,
  updateViewport,
}) => {
  const rankingOptions = useMemo(
    () =>
      [
        {
          label: BOUNDARIES[boundaries.id].level0Noun,
          value: 0,
          level: 0,
        },
        {
          label:
            boundaries.id === 'landforms'
              ? areaInterest[areaInterest.level === 0 ? 'name' : 'parentName']
              : `${BOUNDARIES[boundaries.id].level1Noun} in ${
                  areaInterest[areaInterest.level === 0 ? 'name' : 'parentName']
                }`,
          value: 1,
          level: 1,
          within: areaInterest[areaInterest.level === 0 ? 'id' : 'parentId'],
        },
      ].filter(option => {
        // This case appears when the area of interest is an area drawn by the user
        if (areaInterest.level === undefined || areaInterest.level === null) {
          return option.level === 0;
        } else {
          return areaInterest.level === 0 || option.level === 1;
        }
      }),
    [areaInterest, boundaries]
  );
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [rankingOption, setRankingOption] = useState(rankingOptions[0]);

  const typeOption = useMemo(
    () =>
      socLayerState.config.settings.type.options.find(
        option => option.value === socLayerState.type
      ),
    [socLayerState]
  );

  const { data: results, error } = useResults(debouncedSearch, boundaries.id);

  /**
   * @type {(search: string) => void}
   */
  const updateSearch = useCallback(
    debounce(search => setDebouncedSearch(search), 300),
    [setDebouncedSearch]
  );

  const onClickArea = useCallback(
    result => {
      updateCompareAreaInterest({
        id: result.id,
        name: result.name,
        level: result.level,
        parentId: result.level === 1 ? result.parentId : undefined,
        parentName: result.level === 1 ? result.parentName : undefined,
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

  useEffect(() => {
    if (search.length > 0) {
      updateSearch(search);
    } else {
      setDebouncedSearch('');
    }
  }, [search, updateSearch, setDebouncedSearch]);

  // Whenever the area of interest is changed, we need to make sure the selected ranking option
  // still makes sense
  useEffect(() => setRankingOption(rankingOptions[0]), [areaInterest, rankingOptions]);

  return (
    <div className="c-analysis-compare">
      <button type="button" className="btn btn-outline-primary close-button" onClick={onClose}>
        <Icon name="close" />
      </button>
      <h3 className="h4">Compare with areas of interest</h3>
      <div className="form-group mt-3">
        <input
          type="search"
          aria-label="Search regions, countries, biomes..."
          className="form-control"
          placeholder="Search regions, countries, biomes..."
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
            {socLayerState.id === 'soc-stock' ? (
              <>
                <strong>{typeOption.label}</strong> Soil Organic Carbon change
              </>
            ) : (
              <>
                {' '}
                Soil Organic Carbon <strong>{typeOption.label}</strong> change
              </>
            )}{' '}
            by{' '}
            {rankingOptions.length === 1 ? (
              <>
                {(boundaries.id !== 'landforms' || rankingOption.level === 0) && (
                  <>
                    <strong>
                      {
                        BOUNDARIES[boundaries.id][
                          rankingOption.level === 0 ? 'level0Noun' : 'level1Noun'
                        ]
                      }
                    </strong>
                    {rankingOption.within ? (
                      <>
                        {' '}
                        in{' '}
                        <strong>
                          {areaInterest[areaInterest.level === 0 ? 'name' : 'parentName']}
                        </strong>
                      </>
                    ) : (
                      ''
                    )}
                  </>
                )}
                {boundaries.id === 'landforms' && rankingOption.level === 1 && (
                  <strong>{areaInterest.parentName}</strong>
                )}
              </>
            ) : (
              <Dropdown
                options={rankingOptions}
                value={rankingOption}
                onChange={option => setRankingOption(option)}
              />
            )}
          </div>
          <Ranking
            level={rankingOption.level}
            within={rankingOption.within}
            boundaries={boundaries.id}
            onClickArea={onClickArea}
          />
        </>
      )}

      <div className="drawing-container text-center">
        Or compare with an area drawn on the map
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

AnalysisCompare.propTypes = {
  boundaries: PropTypes.object.isRequired,
  areaInterest: PropTypes.object.isRequired,
  socLayerState: PropTypes.object.isRequired,
  viewport: PropTypes.object.isRequired,
  updateCompareAreaInterest: PropTypes.func.isRequired,
  updateDrawing: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  updateViewport: PropTypes.func.isRequired,
};

export default AnalysisCompare;
