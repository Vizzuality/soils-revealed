import { useStickySWR } from 'utils/hooks';

export const useChange = (socLayerId, type, boundaries, depthIndex, areaInterestId) => {
  const url = `/api/change/${socLayerId}/${type}/${boundaries}/${depthIndex}/${areaInterestId}`;

  return useStickySWR(url, req =>
    fetch(req)
      .then(res => res.json())
      .then(({ data }) => data)
  );
};
