import { useStickySWR } from 'utils/hooks';

export const useTimeseries = (socLayerId, type, boundaries, depthIndex, areaInterestId) => {
  const url = `/api/timeseries/${socLayerId}/${type}/${boundaries}/${depthIndex}/${areaInterestId}`;

  return useStickySWR(url, req =>
    fetch(req)
      .then(res => res.json())
      .then(({ data }) => data)
  );
};
