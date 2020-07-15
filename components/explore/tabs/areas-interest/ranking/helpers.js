import useSWR from 'swr';

export const fetchRanking = async url => {
  const res = await fetch(url);
  const { rows } = await res.json();

  return (
    rows
      .map(({ id, name, value, type, years: rawYears }) => {
        let years = null;
        try {
          if (rawYears.length > 0) {
            years = rawYears
              .replace(/(\[|\]|')/g, '')
              .replace(/\s+/g, '')
              .split(',')
              .map(year => +year);

            if (years.some(year => isNaN(year))) {
              years = null;
            }
          }
          // eslint-disable-next-line no-empty
        } catch (e) {}

        return {
          id,
          name,
          value,
          type,
          years,
        };
      })
      // TODO: We don't have IDs for the river basins for now
      .filter(({ type }) => type !== 'river-basins')
  );
};

export const useRanking = (boundaries, type, depthOption, socLayerId) => {
  const groupType = socLayerId === 'soc-stock' ? type : 'experimental_dataset';
  const variable = socLayerId === 'soc-stock' || type === 'stock' ? 'stocks' : 'concentration';
  const depth = depthOption.label.replace(/\scm/, '');

  const query = `with a as (SELECT id, name_0 as name, 'political-boundaries' as type, mean_diff, years, group_type, variable, depth FROM political_boundaries_change WHERE level = 0 UNION SELECT 1 as id, maj_name as name, 'river-basins' as type, mean_diff, years, group_type, variable, depth FROM hydrological_basins_change WHERE level = 0 UNION SELECT eco_id as id, eco_name as name, 'biomes' as type, mean_diff, years, group_type, variable, depth FROM biomes_change UNION SELECT ne_id as id, name as name, 'landforms' as type, mean_diff, years, group_type, variable, depth FROM landforms_change) SELECT id, name, mean_diff as value, years, variable, type FROM a WHERE group_type = '${groupType}' and variable = '${variable}' and depth = '${depth}' and type = '${boundaries}' ORDER BY value ASC LIMIT 5`;
  const url = encodeURI(`${process.env.API_URL}/sql?q=${query}`);

  return useSWR(url, fetchRanking);
};
