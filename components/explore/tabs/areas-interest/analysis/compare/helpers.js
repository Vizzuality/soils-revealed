import { useSWR } from 'utils/hooks';

export const useResults = (search, allowedBoundaries) => {
  const url = `/api/area-interest/search/${search}?boundaries=${allowedBoundaries}`;

  return useSWR(search.length > 0 ? url : null, req =>
    fetch(req)
      .then(res => res.json())
      .then(({ data }) => data)
  );
};
