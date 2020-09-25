// The dynamic sentence's template is generated via a rule-based system:
// https://link.springer.com/chapter/10.1007/978-3-642-21004-4_7
// It's based on three blocks: facts (the data we have), rules (the conditions), and the outcomes
// (the template)
// Each outcome is linked to a list of rules. If all the rules are true, then the outcome may be
// picked by the algorithm. Several outcomes may be possible at any moment, so the first one to
// become possible will be the one picked.

import React from 'react';
import reactStringReplace from 'react-string-replace';

import { getHumanReadableValue } from 'utils/functions';
import { Dropdown } from 'components/forms';

// Helpers
const not = func => (...params) => !func(...params);

// Rules
export const isComparing = ({ compareAreaInterest }) => !!compareAreaInterest;
export const isFixedPeriodOfTime = ({ socLayerState }) =>
  socLayerState.id === 'soc-experimental' || socLayerState.type === 'recent';
export const isInFuture = ({ socLayerState }) =>
  socLayerState.id === 'soc-stock' && socLayerState.type === 'future';
export const canShowTotalChange = ({ socLayerState }) =>
  socLayerState.id !== 'soc-experimental' || socLayerState.type !== 'concentration';
export const hasOneAreaKeptLevel = ({ data }) => data.average === 0 || data.compareAverage === 0;
export const bothAreasLostOrGained = ({ data }) =>
  (data.average < 0 && data.compareAverage < 0) || (data.average > 0 && data.compareAverage > 0);

// Outcomes
const outcomes = [
  // Single area
  {
    conditions: [not(isComparing), isFixedPeriodOfTime, canShowTotalChange],
    template:
      'From {year1} to {year2}, {area} has experienced a {noun} of soil organic carbon, averaging {average} {unit} at {depth} depth, that amounts to a total of {total} {totalUnit}.',
  },
  {
    conditions: [not(isComparing), isFixedPeriodOfTime, not(canShowTotalChange)],
    template:
      'From {year1} to {year2}, {area} has experienced a {noun} of soil organic carbon, averaging {average} {unit} at {depth} depth.',
  },
  {
    conditions: [not(isComparing), not(isFixedPeriodOfTime), isInFuture, canShowTotalChange],
    template:
      'Under this scenario, {area} would experience a {noun} of soil organic carbon, averaging {average} {unit} at {depth} depth, that would amount to a total of {total} {totalUnit}.',
  },
  {
    conditions: [not(isComparing), not(isFixedPeriodOfTime), isInFuture, not(canShowTotalChange)],
    template:
      'Under this scenario, {area} would experience a {noun} of soil organic carbon, averaging {average} {unit} at {depth} depth.',
  },
  {
    conditions: [not(isComparing), not(isFixedPeriodOfTime), not(isInFuture), canShowTotalChange],
    template:
      '{area} has experienced a {noun} of soil organic carbon, averaging {average} {unit} at {depth} depth, that amounts to a total of {total} {totalUnit}.',
  },
  {
    conditions: [
      not(isComparing),
      not(isFixedPeriodOfTime),
      not(isInFuture),
      not(canShowTotalChange),
    ],
    template:
      '{area} has experienced a {noun} of soil organic carbon, averaging {average} {unit} at {depth} depth.',
  },
  // Comparing areas
  {
    conditions: [isComparing, hasOneAreaKeptLevel, isFixedPeriodOfTime],
    template:
      'From {year1} to {year2}, {area} has {participle} {average} {unit} of soil organic carbon, while {secondaryArea} has maintained its level, at {depth} depth.',
  },
  {
    conditions: [isComparing, hasOneAreaKeptLevel, not(isFixedPeriodOfTime), isInFuture],
    template:
      'Under this scenario, {area} would {verb} {average} {unit} of soil organic carbon, while {secondaryArea} would maintain its level, at {depth} depth.',
  },
  {
    conditions: [isComparing, hasOneAreaKeptLevel, not(isFixedPeriodOfTime), not(isInFuture)],
    template:
      '{area} has {participle} {average} {unit} of soil organic carbon, while {secondaryArea} has maintained its level, at {depth} depth.',
  },
  {
    conditions: [isComparing, not(hasOneAreaKeptLevel), bothAreasLostOrGained, isFixedPeriodOfTime],
    template:
      'From {year1} to {year2}, {area} has experienced {percentage}% more soil carbon {noun} than {secondaryArea}, at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasLostOrGained,
      not(isFixedPeriodOfTime),
      isInFuture,
    ],
    template:
      'Under this scenario, {area} would experience {percentage}% more soil carbon {noun} than {secondaryArea}, at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasLostOrGained,
      not(isFixedPeriodOfTime),
      not(isInFuture),
    ],
    template:
      '{area} has experienced {percentage}% more soil carbon {noun} than {secondaryArea}, at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      not(bothAreasLostOrGained),
      isFixedPeriodOfTime,
    ],
    template:
      'From {year1} to {year2}, {area} has {participle} {average} {unit} of soil organic carbon, while {secondaryArea} has {secondaryParticiple} {secondaryAverage} {unit}, at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      not(bothAreasLostOrGained),
      not(isFixedPeriodOfTime),
      isInFuture,
    ],
    template:
      'Under this scenario, {area} would {verb} {average} {unit} of soil organic carbon, while {secondaryArea} would {secondaryVerb} {secondaryAverage} {unit}, at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      not(bothAreasLostOrGained),
      not(isFixedPeriodOfTime),
      not(isInFuture),
    ],
    template:
      '{area} has {participle} {average} {unit} of soil organic carbon, while {secondaryArea} has {secondaryParticiple} {secondaryAverage} {unit}, at {depth} depth.',
  },
];

/**
 * Return the template of the dynamic sentence
 * @param  {{ socLayerState: any, data: any, compareAreaInterest: any }} params
 */
const getSentenceTemplate = params => {
  const { template } = outcomes.find(outcome =>
    outcome.conditions.every(condition => condition(params))
  );

  if (!template) {
    return null;
  }

  return template;
};

/**
 * Return the parameters of the template
 * @param {*} param0
 */
const getTemplateParameters = ({
  year1Option,
  year2Option,
  depthOptions,
  depthOption,
  areaInterest,
  compareAreaInterest,
  data,
  unit,
  totalFormat,
  totalUnit,
  onChangeDepth,
}) => {
  const areaInterestData = {
    name: areaInterest.name,
    average: data.average,
    total: data.total,
  };

  const compareAreaInterestData = compareAreaInterest
    ? {
        name: compareAreaInterest.name,
        average: data.compareAverage,
        total: data.compareTotal,
      }
    : null;

  let leadingAreaInterestData, secondaryAreaInterestData;
  if (!isComparing({ compareAreaInterest })) {
    leadingAreaInterestData = areaInterestData;
  } else {
    if (hasOneAreaKeptLevel({ data })) {
      if (data.average === 0) {
        leadingAreaInterestData = compareAreaInterestData;
        secondaryAreaInterestData = areaInterestData;
      } else {
        leadingAreaInterestData = areaInterestData;
        secondaryAreaInterestData = compareAreaInterestData;
      }
    } else if (bothAreasLostOrGained({ data })) {
      if (Math.abs(data.average) > Math.abs(data.compareAverage)) {
        leadingAreaInterestData = areaInterestData;
        secondaryAreaInterestData = compareAreaInterestData;
      } else {
        leadingAreaInterestData = compareAreaInterestData;
        secondaryAreaInterestData = areaInterestData;
      }
    } else {
      leadingAreaInterestData = areaInterestData;
      secondaryAreaInterestData = compareAreaInterestData;
    }
  }

  return {
    // eslint-disable-next-line react/display-name
    year1: key => <strong key={key}>{year1Option.value}</strong>,
    // eslint-disable-next-line react/display-name
    year2: key => <strong key={key}>{year2Option.value}</strong>,
    area: () => leadingAreaInterestData.name,
    secondaryArea: () => secondaryAreaInterestData?.name,
    noun: () => (leadingAreaInterestData.average < 0 ? 'loss' : 'gain'),
    secondaryNoun: () => (secondaryAreaInterestData?.average < 0 ? 'loss' : 'gain'),
    verb: () => (leadingAreaInterestData.average < 0 ? 'lose' : 'gain'),
    secondaryVerb: () => (secondaryAreaInterestData?.average < 0 ? 'lose' : 'gain'),
    participle: () => (leadingAreaInterestData.average < 0 ? 'lost' : 'gained'),
    secondaryParticiple: () => (secondaryAreaInterestData?.average < 0 ? 'lost' : 'gained'),
    average: () =>
      getHumanReadableValue(
        isComparing({ compareAreaInterest })
          ? Math.abs(leadingAreaInterestData.average)
          : leadingAreaInterestData.average
      ),
    secondaryAverage: () =>
      secondaryAreaInterestData
        ? getHumanReadableValue(Math.abs(secondaryAreaInterestData.average))
        : null,
    total: () => getHumanReadableValue(totalFormat(leadingAreaInterestData.total)),
    unit: () => unit,
    // eslint-disable-next-line react/display-name
    depth: key =>
      depthOptions.length > 1 ? (
        <Dropdown key={key} options={depthOptions} value={depthOption} onChange={onChangeDepth} />
      ) : (
        <strong key={key}>{depthOption.label}</strong>
      ),
    totalUnit: () => totalUnit,
    percentage: () =>
      secondaryAreaInterestData
        ? getHumanReadableValue(
            (leadingAreaInterestData.average / secondaryAreaInterestData.average - 1) * 100
          )
        : null,
  };
};

/**
 * Return the dynamic sentence
 * @param  {{ socLayerState: any, year1Option: any, year2Option: any, depthOptions: any, depthOption: any, areaInterest: any, compareAreaInterest: any, data: any, unit: string, totalFormat: function, totalUnit: string, onChangeDepth: function }} params
 */
export const getSentence = params => {
  const template = getSentenceTemplate(params);

  if (!template) {
    return null;
  }

  const templateParameters = getTemplateParameters(params);

  let sentence = `${template}`;
  Object.keys(templateParameters).forEach((parameter, index) => {
    // @ts-ignore
    sentence = reactStringReplace(sentence, `{${parameter}}`, () =>
      templateParameters[parameter](index)
    );
  });

  return sentence;
};
