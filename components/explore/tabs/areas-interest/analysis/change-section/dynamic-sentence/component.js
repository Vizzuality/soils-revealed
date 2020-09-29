import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { getSentence } from './helpers';

const DynamicSentence = ({
  data,
  socLayerState,
  areaInterest,
  compareAreaInterest,
  updateLayer,
}) => {
  const typeOption = useMemo(
    () =>
      socLayerState.config.settings.type.options.find(
        option => option.value === socLayerState.type
      ),
    [socLayerState]
  );

  const depthIndex = useMemo(
    () =>
      typeOption.settings.depth.options.findIndex(option => option.value === socLayerState.depth),
    [typeOption, socLayerState]
  );

  const depthOptions = typeOption.settings.depth.options;
  const depthOption = depthOptions[depthIndex];

  const year1Option = useMemo(
    () =>
      socLayerState.id === 'soc-experimental' || socLayerState.type === 'recent'
        ? typeOption.settings.year.options.find(
            option => option.value === `${typeOption.settings.year1.defaultOption}`
          )
        : null,
    [typeOption, socLayerState]
  );

  const year2Option = useMemo(
    () =>
      socLayerState.id === 'soc-experimental' || socLayerState.type === 'recent'
        ? typeOption.settings.year.options.find(
            option => option.value === `${typeOption.settings.year2.defaultOption}`
          )
        : null,
    [typeOption, socLayerState]
  );

  const onChangeDepth = useCallback(
    ({ value }) => updateLayer({ id: socLayerState.id, depth: value }),
    [socLayerState, updateLayer]
  );

  return getSentence({
    socLayerState,
    year1Option,
    year2Option,
    depthOptions,
    depthOption,
    areaInterest,
    compareAreaInterest,
    data,
    onChangeDepth,
  });
};

DynamicSentence.propTypes = {
  data: PropTypes.object.isRequired,
  socLayerState: PropTypes.object.isRequired,
  areaInterest: PropTypes.object.isRequired,
  compareAreaInterest: PropTypes.object,
  updateLayer: PropTypes.func.isRequired,
};

DynamicSentence.defaultProps = {
  compareAreaInterest: null,
};

export default DynamicSentence;
