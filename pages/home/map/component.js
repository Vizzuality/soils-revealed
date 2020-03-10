import React from 'react';

import { Link } from 'lib/routes';
import SectionTitle from 'components/section-title';

import './style.scss';

const Map = () => (
  <div className="c-home-map">
    <div className="map-content">
      <SectionTitle info={{ index: 3, text: 'Discover carbon' }} />
      <h3>Areas to Watch</h3>
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <p className="section-description">
            As well as estimating actual carbon storage, we’ve predicted the potential amount of
            carbon our soils could hold. Using that, you can see the areas where our action can make
            the biggest impact.
          </p>
        </div>
      </div>
      <div className="buttons">
        {/* TO DO: change to the correct route when we get it */}
        <Link route="/about">
          <a className="c-button -secondary">Areas to watch</a>
        </Link>
        <Link route="/discover">
          <a className="c-button -primary">Discover</a>
        </Link>
      </div>
    </div>
  </div>
);

export default Map;
