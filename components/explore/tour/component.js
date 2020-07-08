import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Joyride from 'react-joyride';

import { isFirstVisit } from 'utils/explore';
import { getLayerExtraParams } from 'utils/map';
import { LAYERS } from 'components/map';

import './style.scss';

const STEPS = [
  {
    disableBeacon: true,
    target: '.js-soc-stock-tabs',
    init: ({ activeLayers, updateActiveLayers }) => {
      if (!activeLayers.find(layerId => layerId === 'soc-stock')) {
        updateActiveLayers([
          ...activeLayers.filter(layerId => layerId !== 'soc-experimental'),
          'soc-stock',
        ]);

        // We make sure the UI has had enough time to update
        return new Promise(resolve => setTimeout(resolve, 100));
      }
    },
    content: (
      <div className="c-explore-tour">
        <h1>
          <div className="mb-1">1/4</div>
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
    target: '.js-soc-stock-scenario',
    init: ({ updateLayer }) => {
      // eslint-disable-next-line no-unused-vars
      const { config, ...otherParams } = getLayerExtraParams(
        { ...LAYERS['soc-stock'], id: 'soc-stock' },
        { type: 'future' }
      );

      updateLayer({
        id: 'soc-stock',
        ...otherParams,
      });

      // We make sure the UI has had enough time to update
      return new Promise(resolve => setTimeout(resolve, 100));
    },
    content: (
      <div className="c-explore-tour">
        <h1>
          <div className="mb-1">2/4</div>
          Future projections scenarios.
        </h1>
        <p>
          Observe the future state of the organic carbon stocks by switching from one scenario to
          another.
        </p>
      </div>
    ),
  },
  {
    disableBeacon: true,
    target: '.js-experimental-dataset-toggle',
    init: ({ updateLayer }) => {
      // eslint-disable-next-line no-unused-vars
      const { config, ...otherParams } = getLayerExtraParams(
        { ...LAYERS['soc-stock'], id: 'soc-stock' },
        { type: 'recent' }
      );

      updateLayer({
        id: 'soc-stock',
        ...otherParams,
      });

      // We make sure the UI has had enough time to update
      return new Promise(resolve => setTimeout(resolve, 100));
    },
    content: (
      <div className="c-explore-tour">
        <h1>
          <div className="mb-1">3/4</div>Machine learning dataset.
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
          <div className="mb-1">4/4</div>Add layers and explore different areas.
        </h1>
        <p>
          Check out the main areas where organic carbon has more impact and browse through soil,
          land, and other different kinds of layers.
        </p>
      </div>
    ),
  },
];

const ExploreTour = props => {
  const { showTour, updateShowTour } = props;
  /**
   * @type {[any, function(any): void]}
   */
  const [helpers, setHelpers] = useState({});
  const [opened, setOpened] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const previousShowTour = useRef(showTour);

  // On mount, we check if the user is visiting for the first time
  useEffect(() => {
    if (isFirstVisit()) {
      updateShowTour(true);
    }
  }, [updateShowTour]);

  // Whenever the showTour flag is set to true, we display the tour
  useEffect(() => {
    const startTour = async () => {
      if (STEPS[stepIndex].init) {
        await STEPS[stepIndex].init(props);
      }

      setOpened(true);
      updateShowTour(false);
      previousShowTour.current = showTour;
    };

    if (previousShowTour.current !== showTour) {
      if (showTour) {
        startTour();
      } else {
        previousShowTour.current = showTour;
      }
    }
  }, [previousShowTour.current, showTour, props, stepIndex, setOpened, updateShowTour]);

  const onChange = useCallback(
    ({ action, type }) => {
      const goToNextStep = async () => {
        const nextStepIndex = stepIndex + 1;

        if (STEPS[nextStepIndex]?.init) {
          await STEPS[nextStepIndex].init(props);
        }

        setStepIndex(nextStepIndex);
      };

      const endTour = () => {
        helpers.close();
        setOpened(false);
        setStepIndex(0);
      };

      if (type === 'tour:end') {
        endTour();
      } else if (type === 'step:after') {
        if (action === 'next') {
          goToNextStep();
        } else if (action === 'close') {
          endTour();
        }
      }
    },
    [helpers, stepIndex, props, setOpened, setStepIndex]
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
      stepIndex={stepIndex}
      callback={onChange}
      getHelpers={setHelpers}
    />
  );
};

ExploreTour.propTypes = {
  showTour: PropTypes.bool.isRequired,
  updateShowTour: PropTypes.func.isRequired,
  activeLayers: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateActiveLayers: PropTypes.func.isRequired,
  updateLayer: PropTypes.func.isRequired,
};

export default ExploreTour;
