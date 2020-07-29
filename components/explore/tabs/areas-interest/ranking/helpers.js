import { useStickySWR } from 'utils/hooks';

export const useRanking = (socLayerId, type, boundaries, depthIndex, order) => {
  const url = `/api/area-interest/ranking/${socLayerId}/${type}/${boundaries}/${depthIndex}/${order}`;

  return useStickySWR(url, req =>
    fetch(req)
      .then(res => res.json())
      .then(({ data }) => data)
  );
};
