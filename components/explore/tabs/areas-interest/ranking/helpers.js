import { useStickySWR } from 'utils/hooks';

export const useRanking = (socLayerId, type, boundaries, depthIndex) => {
  const url = `/api/area-interest/ranking/${socLayerId}/${type}/${boundaries}/${depthIndex}`;

  return useStickySWR(url, req =>
    fetch(req)
      .then(res => res.json())
      .then(({ data }) => data)
  );
};
