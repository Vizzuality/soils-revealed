import React, { useState, useCallback, useMemo } from 'react';
import Joyride from 'react-joyride';

import { isFirstVisit } from 'utils/explore';

import './style.scss';

const STEPS = [
  {
    disableBeacon: true,
    target: '.js-soc-stock-tabs',
    content: (
      <div className="c-explore-tour">
        <h1>
          <div className="mb-1">1/3</div>
          Past estimates and future projections.
        </h1>
        <p>
          Check out our estimates for historic and current organic carbon stocks and explore future
          scenarios.
        </p>
      </div>
    ),
  },
  {
    disableBeacon: true,
    target: '.js-map-settings',
    content: (
      <div className="c-explore-tour">
        <h1>
          <div className="mb-1">2/3</div>Explore the map through different boundaries.
        </h1>
        <p>Clicking on the map will show different information depending on the boundaries.</p>
      </div>
    ),
  },
  {
    disableBeacon: true,
    target: '.js-explore-tabs',
    content: (
      <div className="c-explore-tour">
        <h1>
          <div className="mb-1">3/3</div>Add layers and explore different areas.
        </h1>
        <p>
          Check out the main areas where organic carbon has more impact and browse through soil,
          land, and other different kinds of layers.
        </p>
      </div>
    ),
  },
];

const ExploreTour = () => {
  /**
   * @type {[any, function(any): void]}
   */
  const [helpers, setHelpers] = useState({});
  const firstVisit = useMemo(() => isFirstVisit(), []);

  const onChange = useCallback(
    ({ action }) => {
      if (action === 'close' && helpers.close) {
        helpers.close();
      }
    },
    [helpers]
  );

  if (!firstVisit) {
    return null;
  }

  return (
    <Joyride
      continuous
      hideBackButton
      showSkipButton
      locale={{ back: 'Back', close: 'Close', last: 'Done', next: 'Next', skip: 'Skip' }}
      floaterProps={{
        disableAnimation: true,
      }}
      steps={STEPS}
      callback={onChange}
      getHelpers={setHelpers}
    />
  );
};

export default ExploreTour;
