import { useStickySWR } from 'utils/hooks';

export const useChartsData = (
  socLayerId,
  type,
  boundaries,
  depthIndex,
  areaInterestId,
  compareAreaInterestId
) => {
  const url = `/api/charts/${socLayerId}/${type}/${boundaries}/${depthIndex}/`;

  return useStickySWR([url, areaInterestId, compareAreaInterestId], req =>
    fetch(req, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        areaInterest: areaInterestId,
        compareAreaInterest: compareAreaInterestId,
      }),
    })
      .then(res => res.json())
      .then(({ data }) => data)
  );
};
