import React from 'react';

import { Link } from 'lib/routes';
import SectionTitle from 'components/section-title';
import Button from 'components/button';

import './style.scss';

const Map = () => (
  <div className="c-home-map" style={{ backgroundImage: `url(images/homeMapBackground.png)` }}>
    <div
      className="map-content"
      style={{ backgroundImage: `url(images/homeMapBlurryBackground.png)` }}
    >
      <SectionTitle info={{ index: 3, text: 'Discover carbon' }} />
      <h2>Areas to Watch</h2>
      <p className="section-description">
        As well as estimating actual carbon storage, we’ve predicted the potential amount of carbon
        our soils could hold. Using that, you can see the areas where our action can make the
        biggest impact.
      </p>
      <div className="buttons">
        <Button className="-secondary">
          {/* TO DO: change to the correct route when we get it */}
          <Link route="/about">
            <a>Areas to watch</a>
          </Link>
        </Button>
        <Button className="-primary">
          <Link route="/discover">
            <a>Discover</a>
          </Link>
        </Button>
      </div>
    </div>
  </div>
);

export default Map;
