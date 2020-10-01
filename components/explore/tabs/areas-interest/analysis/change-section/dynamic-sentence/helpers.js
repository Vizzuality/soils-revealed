// The dynamic sentence's template is generated via a rule-based system:
// https://link.springer.com/chapter/10.1007/978-3-642-21004-4_7
// It's based on three blocks: facts (the data we have), rules (the conditions), and the outcomes
// (the template)
// Each outcome is linked to a list of rules. If all the rules are true, then the outcome may be
// picked by the algorithm. Several outcomes may be possible at any moment, so the first one to
// become possible will be the one picked.

import React from 'react';
import reactStringReplace from 'react-string-replace';

import { getFormattedValue, getHumanReadableValue } from 'utils/functions';
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
  socLayerState.id !== 'soc-experimental' || socLayerState.type !== 'concentration'; // We also use this condition to check if the change is per unit area
export const isSignificantChange = ({ data }) => Math.abs(data.average) > 0.01;
export const hasOneAreaKeptLevel = ({ data }) => data.average === 0 || data.compareAverage === 0;
export const bothAreasLostOrGained = ({ data }) =>
  (data.average < 0 && data.compareAverage < 0) || (data.average > 0 && data.compareAverage > 0);
export const bothAreasInsignificantChange = ({ data }) =>
  Math.abs(data.average) <= 0.01 && Math.abs(data.compareAverage) <= 0.01;

// Outcomes
const outcomes = [
  // Single area
  {
    conditions: [not(isComparing), isFixedPeriodOfTime, canShowTotalChange, isSignificantChange],
    template:
      'From {year1} to {year2}, {area} has experienced a {noun} of soil organic carbon, averaging {average} {unit} at {depth} depth, which amounts to a total of {total} {totalUnit}.',
  },
  {
    conditions: [
      not(isComparing),
      isFixedPeriodOfTime,
      canShowTotalChange,
      not(isSignificantChange),
    ],
    template:
      'From {year1} to {year2}, {area} has not experienced a significant loss or gain of soil organic carbon per unit area at {depth} depth, while the total {noun} amounts to {total} {totalUnit}.',
  },
  {
    conditions: [
      not(isComparing),
      isFixedPeriodOfTime,
      not(canShowTotalChange),
      isSignificantChange,
    ],
    template:
      'From {year1} to {year2}, {area} has experienced a {noun} of soil organic carbon, averaging {average} {unit} at {depth} depth.',
  },
  {
    conditions: [
      not(isComparing),
      isFixedPeriodOfTime,
      not(canShowTotalChange),
      not(isSignificantChange),
    ],
    template:
      'From {year1} to {year2}, {area} has not experienced a significant loss or gain of soil organic carbon at {depth} depth.',
  },
  {
    conditions: [
      not(isComparing),
      not(isFixedPeriodOfTime),
      isInFuture,
      canShowTotalChange,
      isSignificantChange,
    ],
    template:
      'Under this scenario, {area} would experience a {noun} of soil organic carbon, averaging {average} {unit} at {depth} depth over 20 years until 2038, which would amount to a total of {total} {totalUnit}.',
  },
  {
    conditions: [
      not(isComparing),
      not(isFixedPeriodOfTime),
      isInFuture,
      canShowTotalChange,
      not(isSignificantChange),
    ],
    template:
      'Under this scenario, {area} would not experience a significant loss or gain of soil organic carbon per unit area at {depth} depth over 20 years until 2038, while the total {noun} would amount to {total} {totalUnit}.',
  },
  {
    conditions: [
      not(isComparing),
      not(isFixedPeriodOfTime),
      isInFuture,
      not(canShowTotalChange),
      isSignificantChange,
    ],
    template:
      'Under this scenario, {area} would experience a {noun} of soil organic carbon, averaging {average} {unit} at {depth} depth over 20 years until 2038.',
  },
  {
    conditions: [
      not(isComparing),
      not(isFixedPeriodOfTime),
      isInFuture,
      not(canShowTotalChange),
      not(isSignificantChange),
    ],
    template:
      'Under this scenario, {area} would not experience a significant loss or gain of soil organic carbon at {depth} depth over 20 years until 2038.',
  },
  {
    conditions: [
      not(isComparing),
      not(isFixedPeriodOfTime),
      not(isInFuture),
      canShowTotalChange,
      isSignificantChange,
    ],
    template:
      '{area} has experienced a {noun} of soil organic carbon, averaging {average} {unit} at {depth} depth, which amounts to a total of {total} {totalUnit}.',
  },
  {
    conditions: [
      not(isComparing),
      not(isFixedPeriodOfTime),
      not(isInFuture),
      canShowTotalChange,
      not(isSignificantChange),
    ],
    template:
      '{area} has not experienced a significant loss or gain of soil organic carbon per unit area at {depth} depth, while the total {noun} amounts to {total} {totalUnit}.',
  },
  {
    conditions: [
      not(isComparing),
      not(isFixedPeriodOfTime),
      not(isInFuture),
      not(canShowTotalChange),
      isSignificantChange,
    ],
    template:
      '{area} has experienced a {noun} of soil organic carbon, averaging {average} {unit} at {depth} depth.',
  },
  {
    conditions: [
      not(isComparing),
      not(isFixedPeriodOfTime),
      not(isInFuture),
      not(canShowTotalChange),
      not(isSignificantChange),
    ],
    template:
      '{area} has not experienced a significant loss or gain of soil organic carbon at {depth} depth.',
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
      'Under this scenario, {area} would {verb} {average} {unit} of soil organic carbon, while {secondaryArea} would maintain its level, at {depth} depth and over 20 years until 2038.',
  },
  {
    conditions: [isComparing, hasOneAreaKeptLevel, not(isFixedPeriodOfTime), not(isInFuture)],
    template:
      '{area} has {participle} {average} {unit} of soil organic carbon, while {secondaryArea} has maintained its level, at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasInsignificantChange,
      isFixedPeriodOfTime,
      canShowTotalChange,
    ],
    template:
      'From {year1} to {year2}, neither {area} nor {secondaryArea} have experienced a significant loss or gain of soil organic carbon per unit area at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasInsignificantChange,
      isFixedPeriodOfTime,
      not(canShowTotalChange),
    ],
    template:
      'From {year1} to {year2}, neither {area} nor {secondaryArea} have experienced a significant loss or gain of soil organic carbon at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasInsignificantChange,
      not(isFixedPeriodOfTime),
      isInFuture,
      canShowTotalChange,
    ],
    template:
      'Under this scenario, neither {area} nor {secondaryArea} would experience a significant loss or gain of soil organic carbon per unit area at {depth} depth over 20 years until 2038.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasInsignificantChange,
      not(isFixedPeriodOfTime),
      isInFuture,
      not(canShowTotalChange),
    ],
    template:
      'Under this scenario, neither {area} nor {secondaryArea} would experience a significant loss or gain of soil organic carbon at {depth} depth over 20 years until 2038.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasInsignificantChange,
      not(isFixedPeriodOfTime),
      not(isInFuture),
      canShowTotalChange,
    ],
    template:
      'Neither {area} nor {secondaryArea} have experienced a significant loss or gain of soil organic carbon per unit area at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasInsignificantChange,
      not(isFixedPeriodOfTime),
      not(isInFuture),
      not(canShowTotalChange),
    ],
    template:
      'Neither {area} nor {secondaryArea} have experienced a significant loss or gain of soil organic carbon at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasLostOrGained,
      isFixedPeriodOfTime,
      canShowTotalChange,
    ],
    template:
      'From {year1} to {year2}, {area} has experienced {percentage}% more soil organic carbon {noun} per unit area than {secondaryArea}, at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasLostOrGained,
      isFixedPeriodOfTime,
      not(canShowTotalChange),
    ],
    template:
      'From {year1} to {year2}, {area} has experienced {percentage}% more soil organic carbon {noun} than {secondaryArea}, at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasLostOrGained,
      not(isFixedPeriodOfTime),
      isInFuture,
      canShowTotalChange,
    ],
    template:
      'Under this scenario, {area} would experience {percentage}% more soil organic carbon {noun} per unit area than {secondaryArea}, at {depth} depth and over 20 years until 2038.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasLostOrGained,
      not(isFixedPeriodOfTime),
      isInFuture,
      not(canShowTotalChange),
    ],
    template:
      'Under this scenario, {area} would experience {percentage}% more soil organic carbon {noun} than {secondaryArea}, at {depth} depth and over 20 years until 2038.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasLostOrGained,
      not(isFixedPeriodOfTime),
      not(isInFuture),
      canShowTotalChange,
    ],
    template:
      '{area} has experienced {percentage}% more soil organic carbon {noun} per unit area than {secondaryArea}, at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      bothAreasLostOrGained,
      not(isFixedPeriodOfTime),
      not(isInFuture),
      not(canShowTotalChange),
    ],
    template:
      '{area} has experienced {percentage}% more soil organic carbon {noun} than {secondaryArea}, at {depth} depth.',
  },
  {
    conditions: [
      isComparing,
      not(hasOneAreaKeptLevel),
      not(bothAreasLostOrGained),
      isFixedPeriodOfTime,
    ],
    template:
      'From {year1} to {year2}, {area} has {participle} {average} {unit} of soil organic carbon, while {secondaryArea} has {secondaryParticiple} {secondaryAverage} {secondaryUnit}, at {depth} depth.',
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
      'Under this scenario, {area} would {verb} {average} {unit} of soil organic carbon, while {secondaryArea} would {secondaryVerb} {secondaryAverage} {secondaryUnit}, at {depth} depth and over 20 years until 2038.',
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
      '{area} has {participle} {average} {unit} of soil organic carbon, while {secondaryArea} has {secondaryParticiple} {secondaryAverage} {secondaryUnit}, at {depth} depth.',
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
  socLayerState,
  year1Option,
  year2Option,
  depthOptions,
  depthOption,
  areaInterest,
  compareAreaInterest,
  data,
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
    total: () =>
      getFormattedValue(
        leadingAreaInterestData.total,
        socLayerState.id,
        socLayerState.type,
        'analysis-change-total'
      ).value,
    unit: () =>
      getFormattedValue(
        leadingAreaInterestData.average,
        socLayerState.id,
        socLayerState.type,
        'analysis-change-avg'
      ).unit,
    secondaryUnit: () =>
      secondaryAreaInterestData
        ? getFormattedValue(
            secondaryAreaInterestData.average,
            socLayerState.id,
            socLayerState.type,
            'analysis-change-avg'
          ).unit
        : null,
    // eslint-disable-next-line react/display-name
    depth: key =>
      depthOptions.length > 1 ? (
        <Dropdown key={key} options={depthOptions} value={depthOption} onChange={onChangeDepth} />
      ) : (
        <strong key={key}>{depthOption.label}</strong>
      ),
    totalUnit: () =>
      getFormattedValue(
        leadingAreaInterestData.total,
        socLayerState.id,
        socLayerState.type,
        'analysis-change-total'
      ).unit,
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
 * @param  {{ socLayerState: any, year1Option: any, year2Option: any, depthOptions: any, depthOption: any, areaInterest: any, compareAreaInterest: any, data: any, onChangeDepth: function }} params
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
