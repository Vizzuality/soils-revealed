import { useStickySWR } from 'utils/hooks';

/**
 * Calculate the standard deviation of the data
 * @param {Array<Object>} data Data rows
 * @param {string} xKey Property name of the X axis value
 * @param {string} yKey Property name of the Y axis value
 */
const calculateStandardDeviation = (data, xKey, yKey) => {
  const sum = data.reduce((res, d) => res + d[yKey], 0);
  const mean = (1 / sum) * data.reduce((res, d) => res + d[xKey] * d[yKey], 0);
  return {
    standardDeviation: Math.sqrt(
      (1 / sum) * data.reduce((res, d) => res + d[yKey] * Math.pow(mean - d[xKey], 2), 0)
    ),
    mean,
  };
};

export const useChange = (
  socLayerId,
  type,
  boundaries,
  depthIndex,
  areaInterestId,
  compareAreaInterestId
) => {
  const url = `/api/change/${socLayerId}/${type}/${boundaries}/${depthIndex}/${areaInterestId}${
    compareAreaInterestId ? `?compare=${compareAreaInterestId}` : ''
  }`;

  return useStickySWR(url, req =>
    fetch(req)
      .then(res => res.json())
      // Here we remove the values on the sides that are very low so we don't loose space
      // displaying bars of 1px high
      // This calculation is not done on the server because we want to let the user download the
      // raw data
      .then(({ data }) => {
        if (!data?.rows) {
          return {
            ...data,
            rows: [],
          };
        }

        // The chart represents a normal distribution, so if we trim the values outside of 2
        // standard deviations, it will still represent 95% of the values:
        // https://en.wikipedia.org/wiki/Normal_distribution#Standard_deviation_and_coverage
        // The details of the calculations can be found here:
        // https://math.stackexchange.com/questions/857566/how-to-get-the-standard-deviation-of-a-given-histogram-image
        const dataDeviation = calculateStandardDeviation(data.rows, 'bin', 'value');

        if (!compareAreaInterestId) {
          return {
            ...data,
            rows: data.rows.filter(
              ({ bin }) =>
                bin >= dataDeviation.mean - 3 * dataDeviation.standardDeviation &&
                bin <= dataDeviation.mean + 3 * dataDeviation.standardDeviation
            ),
          };
        }

        const compareDataDeviation = calculateStandardDeviation(data.rows, 'bin', 'compareValue');

        const minBin = Math.min(
          dataDeviation.mean - 3 * dataDeviation.standardDeviation,
          compareDataDeviation.mean - 3 * compareDataDeviation.standardDeviation
        );
        const maxBin = Math.max(
          dataDeviation.mean + 3 * dataDeviation.standardDeviation,
          compareDataDeviation.mean + 3 * compareDataDeviation.standardDeviation
        );

        return {
          ...data,
          rows: data.rows.filter(({ bin }) => bin >= minBin && bin <= maxBin),
        };
      })
  );
};

/**
 * Approximate or truncate the number so it is more readable
 * @param {number} number Number to format
 */
export const getHumanReadableValue = number => {
  if (number > 0 && number < 0.01) {
    return '< 0.01';
  }

  if (number < 0 && number > -0.01) {
    return '≈ 0';
  }

  return number.toFixed(2);
};
