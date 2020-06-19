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
    target: '.js-experimental-dataset-toggle',
    content: (
      <div className="c-explore-tour">
        <h1>
          <div className="mb-1">2/3</div>Machine learning dataset.
        </h1>
        <p>
          Explore a new kind of dataset to predict continuous fields of soils properties at X depth
          regions. Currently available in some regions.
        </p>
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
