import React from 'react';
import Button from 'components/button';
import Icon from 'components/icon';

import './style.scss';


const Search = () => {

  const updateSearch = (e) => {

  }
  const handleClick = () => {
  }

  return (
    <div className="c-search">
      <input
        autoFocus
        type="search"
        className="search-input"
        placeholder='SEARCH A PROJECT...'
        onChange={updateSearch}
      >
        <Button>
          Filter by
        </Button>
      </input>
      <Icon name="search" />
    </div>
  )
};

export default Search;
