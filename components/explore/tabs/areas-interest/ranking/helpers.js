import { useStickySWR } from 'utils/hooks';

export const useRanking = (socLayerId, type, boundaries, depthIndex, level, order, within) => {
  const url = `/api/area-interest/ranking/${socLayerId}/${type}/${depthIndex}/${boundaries}/${level}/${order}${
    within ? `?within=${within}` : ''
  }`;

  return useStickySWR(url, req =>
    fetch(req)
      .then(res => res.json())
      .then(({ data }) => data)
  );
};
