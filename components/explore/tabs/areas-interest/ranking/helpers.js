import { useStickySWR } from 'utils/hooks';

export const useRanking = (
  socLayerId,
  type,
  boundaries,
  depthIndex,
  level,
  order,
  aggregation,
  within
) => {
  const url = `/api/area-interest/ranking/${socLayerId}/${type}/${depthIndex}/${boundaries}/${level}/${order}/${aggregation}${
    within ? `?within=${within}` : ''
  }`;

  return useStickySWR(url, req =>
    fetch(req)
      .then(res => res.json())
      .then(({ data }) => data)
  );
};
