import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { getHumanReadableValue } from 'utils/functions';
import { Dropdown } from 'components/forms';

const DynamicSentence = ({
  data,
  unit,
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

  // We're not comparing, we only show the info of the selected area
  if (!compareAreaInterest) {
    return (
      <>
        {(socLayerState.id === 'soc-experimental' || socLayerState.type === 'recent') && (
          <>
            From <strong>{year1Option.value}</strong> to <strong>{year2Option.value}</strong>,{' '}
          </>
        )}
        {areaInterest.name} has experienced a {data.average < 0 ? 'loss' : 'gain'} of soil organic
        carbon, averaging {getHumanReadableValue(data.average)} {unit} at{' '}
        {depthOptions.length > 1 && (
          <Dropdown options={depthOptions} value={depthOption} onChange={onChangeDepth} />
        )}
        {depthOptions.length <= 1 && <strong>{depthOption.label}</strong>} depth.
      </>
    );
  }

  // We're comparing and both areas have gained or lost carbon
  if (
    (data.average < 0 && data.compareAverage < 0) ||
    (data.average > 0 && data.compareAverage > 0)
  ) {
    let percentage;
    let leadingArea;
    let secondaryArea;
    if (Math.abs(data.average) > Math.abs(data.compareAverage)) {
      percentage = getHumanReadableValue((data.average / data.compareAverage - 1) * 100);
      leadingArea = areaInterest.name;
      secondaryArea = compareAreaInterest.name;
    } else {
      percentage = getHumanReadableValue((data.compareAverage / data.average - 1) * 100);
      leadingArea = compareAreaInterest.name;
      secondaryArea = areaInterest.name;
    }

    return (
      <>
        {(socLayerState.id === 'soc-experimental' || socLayerState.type === 'recent') && (
          <>
            From <strong>{year1Option.value}</strong> to <strong>{year2Option.value}</strong>,{' '}
          </>
        )}
        {leadingArea} has experienced {percentage}% more soil carbon{' '}
        {data.average < 0 ? 'loss' : 'gain'} than {secondaryArea}, at{' '}
        {depthOptions.length > 1 && (
          <Dropdown options={depthOptions} value={depthOption} onChange={onChangeDepth} />
        )}
        {depthOptions.length <= 1 && <strong>{depthOption.label}</strong>} depth.
      </>
    );
  }

  // We're comparing and one area has gained carbon and the other has lost some
  if (
    (data.average < 0 && data.compareAverage > 0) ||
    (data.average > 0 && data.compareAverage < 0)
  ) {
    return (
      <>
        {(socLayerState.id === 'soc-experimental' || socLayerState.type === 'recent') && (
          <>
            From <strong>{year1Option.value}</strong> to <strong>{year2Option.value}</strong>,{' '}
          </>
        )}
        {areaInterest.name} has {data.average < 0 ? 'lost' : 'gained'}{' '}
        {getHumanReadableValue(Math.abs(data.average))} {unit} of soil organic carbon, while{' '}
        {compareAreaInterest.name} has {data.compareAverage < 0 ? 'lost' : 'gained'}{' '}
        {getHumanReadableValue(Math.abs(data.compareAverage))} {unit}, at{' '}
        {depthOptions.length > 1 && (
          <Dropdown options={depthOptions} value={depthOption} onChange={onChangeDepth} />
        )}
        {depthOptions.length <= 1 && <strong>{depthOption.label}</strong>} depth.
      </>
    );
  }

  if (data.average === 0 || data.compareAverage === 0) {
    const leadingArea = data.average === 0 ? compareAreaInterest.name : areaInterest.name;
    const secondaryArea = data.average === 0 ? areaInterest.name : compareAreaInterest.name;
    const leadingAverage = data.average === 0 ? data.compareAverage : data.average;

    return (
      <>
        {(socLayerState.id === 'soc-experimental' || socLayerState.type === 'recent') && (
          <>
            From <strong>{year1Option.value}</strong> to <strong>{year2Option.value}</strong>,{' '}
          </>
        )}
        {leadingArea} has {leadingAverage < 0 ? 'lost' : 'gained'}{' '}
        {getHumanReadableValue(Math.abs(leadingAverage))} {unit} of soil organic carbon, while{' '}
        {secondaryArea} has maintained its level, at{' '}
        {depthOptions.length > 1 && (
          <Dropdown options={depthOptions} value={depthOption} onChange={onChangeDepth} />
        )}
        {depthOptions.length <= 1 && <strong>{depthOption.label}</strong>} depth.
      </>
    );
  }

  return null;
};

DynamicSentence.propTypes = {
  data: PropTypes.object.isRequired,
  unit: PropTypes.string.isRequired,
  socLayerState: PropTypes.object.isRequired,
  areaInterest: PropTypes.object.isRequired,
  compareAreaInterest: PropTypes.object,
  updateLayer: PropTypes.func.isRequired,
};

DynamicSentence.defaultProps = {
  compareAreaInterest: null,
};

export default DynamicSentence;
