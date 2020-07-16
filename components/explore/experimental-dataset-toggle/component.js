import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { Switch } from 'components/forms';
import HintButton from 'components/hint-button';
import { LAYERS } from 'components/map';

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
        Experimental dataset{' '}
        <HintButton icon="info" size="large">
          {LAYERS['soc-experimental'].description}
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
