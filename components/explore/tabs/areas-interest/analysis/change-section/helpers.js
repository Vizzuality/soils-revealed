import { useStickySWR } from 'utils/hooks';

/**
 * Calculate the standard deviation of the data
 * @param {Array<Object>} data Data rows
 * @param {string} xKey Property name of the X axis value
 * @param {string} yKey Property name of the Y axis value
 */
const calculateStandardDeviation = (data, xKey, yKey) => {
  // The details of the calculations can be found here:
  // https://math.stackexchange.com/questions/857566/how-to-get-the-standard-deviation-of-a-given-histogram-image
  const sum = data.reduce((res, d) => res + d[yKey], 0);
  const mean = (1 / sum) * data.reduce((res, d) => res + d[xKey] * d[yKey], 0);
  return {
    standardDeviation: Math.sqrt(
      (1 / sum) * data.reduce((res, d) => res + d[yKey] * Math.pow(mean - d[xKey], 2), 0)
    ),
    mean,
  };
};

/**
 * Trim the number of rows in such a way than we reduce the number of bins (bars), while keeping a
 * large enough sample of the original data
 * @param {Array<Object>} data Data rows
 * @param {string} xKey Property name of the X axis value
 * @param {string} yKey Property name of the Y axis value
 */
const getTrimmedData = (data, xKey, yKey) => {
  if (data.length === 0) {
    return data;
  }

  // To trim the edges of the curve, we would like to use a specific number of standard deviations
  // around the mean, like 3 (which would keep 99.7% of the data) or 2 (95%):
  // https://en.wikipedia.org/wiki/Normal_distribution#Standard_deviation_and_coverage
  // Unfortunately, for datasets that have a very low deviation, that would mean that the higher the
  // number of deviations we use to cut, the more we would cut data unecessarily
  // That would also mean that a chart that has very few bars would get even less
  //
  // To make sure we cut the number of bins of datasets with high deviation, but still keep a
  // reasonable number of them for datasets with a low one, we'll use this algorithm:
  // - On one side, we'll filter the dataset using a STANDARD_DEVIATION_COUNT deviation count
  // - On the other side, we'll filter the dataset keeping MIN_BIN_COUNT bins, centered around the
  //   mean
  // If the first calculation returns less than MIN_BIN_COUNT bins, then we'll return the
  // result of the second. If it returns more, then we'll return this result.
  const STANDARD_DEVIATION_COUNT = 1.5; // About 87% of the data is kept
  const MIN_BIN_COUNT = 15; // Must be odd; might not be respected: see other comments below

  const { mean, standardDeviation } = calculateStandardDeviation(data, xKey, yKey);
  const trimmedRows = data.filter(
    ({ bin }) =>
      bin >= mean - STANDARD_DEVIATION_COUNT * standardDeviation &&
      bin <= mean + STANDARD_DEVIATION_COUNT * standardDeviation
  );

  if (trimmedRows.length >= MIN_BIN_COUNT) {
    return trimmedRows;
  }

  let differenceToMean = Infinity;
  let closestToMeanBinIndex;
  for (let i = 0, j = data.length; i < j; i++) {
    const difference = Math.abs(mean - data[i].bin);
    if (difference < differenceToMean) {
      differenceToMean = difference;
      closestToMeanBinIndex = i;
    }
  }

  // NOTE: if data has less than MIN_BIN_COUNT rows initially or the bin closest to the mean is
  // close to the beginning of the data (or its end), then this algorithm will return less than
  // MIN_BIN_COUNT rows
  const minBinIndex = Math.max(0, closestToMeanBinIndex - (MIN_BIN_COUNT - 1) / 2);
  const maxBinIndex = Math.min(data.length - 1, closestToMeanBinIndex + (MIN_BIN_COUNT - 1) / 2);

  return data.slice(minBinIndex, maxBinIndex + 1);
};

/**
 * Parse the change data to reduce the number of bars
 * @param {{ average: number, compareAverage?: number, rows: { bin: number, value: number, compareValue?: number }[] }} data Change data as coming from the API
 * @param {boolean} isComparing Whether the data contains 2 areas being compared
 */
export const getParsedData = (data, isComparing) => {
  if (!data) {
    return data;
  }

  const trimmedData = getTrimmedData(data.rows, 'bin', 'value');

  if (!isComparing) {
    return {
      ...data,
      rows: trimmedData,
    };
  }

  const trimmedCompareData = getTrimmedData(data.rows, 'bin', 'compareValue');

  const bins = [
    ...new Set([...trimmedData.map(d => d.bin), ...trimmedCompareData.map(d => d.bin)]),
  ].sort((a, b) => a - b);

  // NOTE: the two datasets might not be centered on the same mean at all, so we could still
  // display a large number of bins/bars because the getTrimmedData only take into account
  // one dataset at a time
  return {
    ...data,
    rows: bins.map(bin => ({
      bin,
      value: trimmedData.find(d => d.bin === bin)?.value,
      compareValue: trimmedCompareData.find(d => d.bin === bin)?.compareValue,
    })),
  };
};
