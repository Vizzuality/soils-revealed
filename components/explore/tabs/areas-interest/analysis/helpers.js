import { useStickySWR } from 'utils/hooks';

export const useChartsData = (
  socLayerId,
  type,
  boundaries,
  depthIndex,
  areaInterest,
  compareAreaInterest
) => {
  const url = `/api/charts/${socLayerId}/${type}/${boundaries}/${depthIndex}/`;

  return useStickySWR(
    [
      url,
      areaInterest.geo ? JSON.stringify(areaInterest.geo) : areaInterest.id,
      compareAreaInterest?.geo ? JSON.stringify(compareAreaInterest.geo) : compareAreaInterest?.id,
    ],
    req =>
      fetch(req, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          areaInterest: areaInterest.geo ? areaInterest.geo : areaInterest.id,
          compareAreaInterest:
            (compareAreaInterest?.geo ? compareAreaInterest.geo : compareAreaInterest?.id) ??
            undefined,
        }),
      })
        .then(res => res.json())
        .then(({ data }) => data)
  );
};
