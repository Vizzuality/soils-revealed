import { useSWR } from 'utils/hooks';

export const useResults = search => {
  const url = `/api/area-interest/search/${search}`;

  return useSWR(search.length > 0 ? url : null, req =>
    fetch(req)
      .then(res => res.json())
      .then(({ data }) => data)
  );
};
