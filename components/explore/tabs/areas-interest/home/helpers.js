import useSWR from 'swr';

export const fetchResults = async url => {
  const res = await fetch(url);
  const { rows } = await res.json();

  return (
    rows
      // TODO: We don't have IDs for the river basins for now
      .filter(({ type }) => type !== 'river-basins')
      .sort((a, b) => a.name.localeCompare(b.name))
  );
};

export const useResults = search => {
  const url =
    search.length > 0
      ? encodeURI(
          `${
            process.env.API_URL
          }/sql?q=with a as (SELECT distinct(name_0) as name, id, 'political-boundaries' as type FROM political_boundaries_time_series UNION SELECT distinct(name_1) as name, id, 'political-boundaries' as type FROM political_boundaries_time_series UNION SELECT distinct(maj_name) as name, 1 as id, 'river-basins' as type FROM hydrological_basins_time_series UNION SELECT distinct(sub_name) as name, 1 as id, 'river-basins' as type FROM hydrological_basins_time_series UNION SELECT distinct(eco_name) as name, eco_id as id, 'biomes' as type FROM biomes_time_series UNION SELECT distinct(name) as name, ne_id as id, 'landforms' as type FROM landforms_time_series) SELECT name, id, type FROM a WHERE lower(name) like '${search.toLowerCase()}%'`
        )
      : null;

  return useSWR(url, fetchResults);
};
