import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { BOUNDARIES } from 'components/map';
import { useResults } from './helpers';

import './style.scss';

const AreasInterestHome = ({ boundaries, updateBoundaries, updateAreaInterest }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data: results } = useResults(debouncedSearch);

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

      updateAreaInterest({
        id: result.id,
        name: result.name,
      });
    },
    [boundaries, updateBoundaries, updateAreaInterest]
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
      <h3>Areas of interest</h3>
      <div className="form-group mt-3">
        <input
          type="search"
          aria-label="Search provinces, countries, biomes..."
          className="form-control"
          placeholder="Search provinces, countries, biomes..."
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        />
      </div>
      {debouncedSearch.length > 0 && !!results && results.length === 0 && (
        <div className="search-results">No results.</div>
      )}
      {debouncedSearch.length > 0 && results?.length > 0 && (
        <div className="search-results">
          {results.map(result => (
            <div key={`${result.id}-${result.type}`} className="row">
              <div className="col-7">
                <button type="button" className="btn btn-link" onClick={() => onClickArea(result)}>
                  {result.name}
                </button>
              </div>
              <div className="col-5">{BOUNDARIES[result.type].label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="alert alert-warning" role="alert">
        This feature is currently under development.
      </div>
    </div>
  );
};

AreasInterestHome.propTypes = {
  boundaries: PropTypes.string.isRequired,
  updateBoundaries: PropTypes.func.isRequired,
  updateAreaInterest: PropTypes.func.isRequired,
};

export default AreasInterestHome;
