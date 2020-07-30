const axios = require('axios').default;
const omit = require('lodash/omit');

module.exports = ({ params: { search }, query: { boundaries } }, res) => {
  try {
    const query = `
      with a as (
        SELECT distinct(name_0) as name, id, 'political-boundaries' as type, depth, variable, group_type, level, name_0 as parent_name, -1 as parent_id
        FROM political_boundaries_time_series
        WHERE level = 0

        UNION

        SELECT distinct(name_1) as name, id, 'political-boundaries' as type, depth, variable, group_type, level, name_0 as parent_name, -1 as parent_id
        FROM political_boundaries_time_series
        WHERE level = 1

        UNION

        SELECT distinct(maj_name) as name, 1 as id, 'river-basins' as type, depth, variable, group_type, level, maj_name as parent_name, -1 as parent_id
        FROM hydrological_basins_time_series
        WHERE level = 0

        UNION

        SELECT distinct(sub_name) as name, 1 as id, 'river-basins' as type, depth, variable, group_type, level, maj_name as parent_name, -1 as parent_id
        FROM hydrological_basins_time_series
        WHERE level = 1

        UNION

        SELECT distinct(eco_name) as name, eco_id as id, 'biomes' as type, depth, variable, group_type, 1 as level, biome_name as parent_name, -1 as parent_id
        FROM biomes_time_series

        UNION

        SELECT distinct(name) as name, ne_id as id, 'landforms' as type, depth, variable, group_type, 1 as level, featurecla as parent_name, -1 as parent_id
        FROM landforms_time_series
      )

      SELECT name, id, type, level, parent_name, parent_id
      FROM a
      WHERE depth = '0-30' and variable = 'stocks' and group_type = 'historic' and lower(name) like '${search.toLowerCase()}%'
    `;

    const url = encodeURI(`${process.env.API_URL}/sql?q=${query}`);

    const allowedBoundaries = boundaries ? boundaries.split(',') : [];

    axios
      .get(url, {
        headers: { Accept: 'application/json' },
      })
      .then(({ data: { rows } }) =>
        rows
          .map(row => ({
            ...omit(row, 'parent_id', 'parent_name'),
            parentId: row.parent_id,
            parentName: row.parent_name,
          }))
          // TODO: We don't have IDs for the river basins for now
          .filter(({ type }) => type !== 'river-basins')
          .filter(({ type }) => {
            if (allowedBoundaries.length > 0) {
              return allowedBoundaries.indexOf(type) !== -1;
            }

            return true;
          })
          .sort((a, b) => a.name.localeCompare(b.name))
      )
      .then(data => {
        // We cache the result for 10 minutes
        res.set('Cache-Control', `public,max-age=${10 * 60}`);
        res.send({ data });
      });
  } catch (e) {
    console.log(e);
    res.status(404).end();
  }
};
