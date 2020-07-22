import { useStickySWR } from 'utils/hooks';

export const useChange = (socLayerId, type, boundaries, depthIndex, areaInterestId) => {
  const url = `/api/change/${socLayerId}/${type}/${boundaries}/${depthIndex}/${areaInterestId}`;

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

        // The chart represents a normal distribution, so if we trim the values outside of 3
        // standard deviations, it will still represent 99.7% of the values:
        // https://en.wikipedia.org/wiki/Normal_distribution#Standard_deviation_and_coverage
        // The details of the calculations can be found here:
        // https://math.stackexchange.com/questions/857566/how-to-get-the-standard-deviation-of-a-given-histogram-image
        const sum = data.rows.reduce((res, { value }) => res + value, 0);
        const mean = (1 / sum) * data.rows.reduce((res, { bin, value }) => res + bin * value, 0);
        const standardDeviation = Math.sqrt(
          (1 / sum) *
            data.rows.reduce((res, { bin, value }) => res + value * Math.pow(mean - bin, 2), 0)
        );

        return {
          ...data,
          rows: data.rows.filter(
            ({ bin }) => bin >= mean - 3 * standardDeviation && bin <= mean + 3 * standardDeviation
          ),
        };
      })
  );
};
