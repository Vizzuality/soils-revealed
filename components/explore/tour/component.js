import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
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

const ExploreTour = ({ showTour, updateShowTour }) => {
  /**
   * @type {[any, function(any): void]}
   */
  const [helpers, setHelpers] = useState({});
  const [previousShowTour, setPreviousShowTour] = useState(showTour);
  const [opened, setOpened] = useState(false);

  // On mount, we check if the user is visiting for the first time
  useEffect(() => {
    if (isFirstVisit()) {
      updateShowTour(true);
    }
  }, [updateShowTour]);

  // Whenever the showTour flag is set to true, we display the tour
  useEffect(() => {
    if (previousShowTour !== showTour) {
      if (showTour) {
        setOpened(true);
        updateShowTour(false);
      }
      setPreviousShowTour(showTour);
    }
  }, [previousShowTour, showTour, setOpened, setPreviousShowTour, updateShowTour]);

  const onChange = useCallback(
    ({ action }) => {
      if ((action === 'close' || action === 'reset') && helpers.close) {
        helpers.close();
        setOpened(false);
      }
    },
    [helpers, setOpened]
  );

  if (!opened) {
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

ExploreTour.propTypes = {
  showTour: PropTypes.bool.isRequired,
  updateShowTour: PropTypes.func.isRequired,
};

export default ExploreTour;
