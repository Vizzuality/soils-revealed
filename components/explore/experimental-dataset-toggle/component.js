import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { logEvent } from 'utils/analytics';
import { Switch } from 'components/forms';
import HintButton from 'components/hint-button';

import './style.scss';

const ExploreExperimentalDatasetToggle = ({
  basemap,
  activeLayers,
  layersByGroup,
  updateActiveLayers,
}) => {
  const invert = basemap === 'dark' || basemap === 'satellite' || basemap === 'landsat';

  const isToggledOn = activeLayers.indexOf('soc-experimental') !== -1;

  const onChange = useCallback(() => {
    logEvent('Experimental dataset', `toggles ${isToggledOn ? 'off' : 'on'}`);

    const socLayers = layersByGroup.soc.layers.map(layer => layer.id);
    updateActiveLayers([
      ...activeLayers.filter(activeLayer => socLayers.indexOf(activeLayer) === -1),
      isToggledOn
        ? socLayers.filter(socLayer => socLayer !== 'soc-experimental')
        : 'soc-experimental',
    ]);
  }, [isToggledOn, layersByGroup, activeLayers, updateActiveLayers]);

  return (
    <div
      className={[
        'c-explore-experimental-dataset-toggle',
        'js-experimental-dataset-toggle',
        ...(invert ? ['-invert'] : []),
      ].join(' ')}
    >
      <Switch
        id="explore-experimental-dataset-toggle"
        className="-transparent"
        checked={isToggledOn}
        onChange={onChange}
      >
        Experimental approach{' '}
        <HintButton icon="info" size="large">
          For Argentina, you can view an alternative, innovative approach to map soil organic carbon
          change. This differs from the other maps by using a machine learning model calibrated on
          5,000 ground samples across Argentina over four decades allowing better understanding of
          soil organic carbon changes over time. We imagine that this approach will provide
          inspiration for conducting similar analyses for the globe.
        </HintButton>
      </Switch>
    </div>
  );
};

ExploreExperimentalDatasetToggle.propTypes = {
  basemap: PropTypes.string.isRequired,
  activeLayers: PropTypes.arrayOf(PropTypes.string).isRequired,
  layersByGroup: PropTypes.object.isRequired,
  updateActiveLayers: PropTypes.func.isRequired,
};

export default ExploreExperimentalDatasetToggle;
