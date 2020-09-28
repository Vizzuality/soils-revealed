const axios = require('axios').default;
const omit = require('lodash/omit');

module.exports = ({ params: { search }, query: { boundaries } }, res) => {
  try {
    const query = `
      with a as (
        SELECT distinct(name_0) as name, id, 'political-boundaries' as type, depth, variable, group_type, level, name_0 as parent_name, id_0 as parent_id, bbox
        FROM political_boundaries_time_series
        WHERE level = 0

        UNION

        SELECT distinct(name_1) as name, id, 'political-boundaries' as type, depth, variable, group_type, level, name_0 as parent_name, id_0 as parent_id, bbox
        FROM political_boundaries_time_series
        WHERE level = 1

        UNION

        SELECT distinct(maj_name) as name, id, 'river-basins' as type, depth, variable, group_type, level, maj_name as parent_name, id_0 as parent_id, bbox
        FROM hydrological_basins_time_series
        WHERE level = 0

        UNION

        SELECT distinct(sub_name) as name, id, 'river-basins' as type, depth, variable, group_type, level, maj_name as parent_name, id_0 as parent_id, bbox
        FROM hydrological_basins_time_series
        WHERE level = 1

        UNION

        SELECT distinct(biome_name) as name, id, 'biomes' as type, depth, variable, group_type, level, biome_name as parent_name, id_0 as parent_id, bbox
        FROM biomes_time_series
        WHERE level = 0

        UNION

        SELECT distinct(eco_name) as name, id, 'biomes' as type, depth, variable, group_type, level, biome_name as parent_name, id_0 as parent_id, bbox
        FROM biomes_time_series
        WHERE level = 1

        UNION

        SELECT distinct(featurecla) as name, id, 'landforms' as type, depth, variable, group_type, level, featurecla as parent_name, id_0 as parent_id, bbox
        FROM landforms_time_series
        WHERE level = 0

        UNION

        SELECT distinct(name) as name, id, 'landforms' as type, depth, variable, group_type, level, featurecla as parent_name, id_0 as parent_id, bbox
        FROM landforms_time_series
        WHERE level = 1
      )

      SELECT name, id, type, level, parent_name, parent_id, bbox
      FROM a
      WHERE depth = '0-30' and variable = 'stocks' and group_type = 'historic' and lower(name) like '${search.toLowerCase()}%'
    `;

    // Carto may incorrectly cache the data (the cache is not cleaned when data changes) so to avoid
    // that, we send a dummy parameter (here `t`), which contains today's date
    // In addition, we want to clean the cache each time we deploy, so we use another parameter,
    // `d`, which contains the deployment key
    const url = encodeURI(
      `${process.env.API_URL}/sql?q=${query}&t=${new Date().toISOString().split('T')[0]}&d=${
        process.env.DEPLOYMENT_KEY
      }`
    );

    const allowedBoundaries = boundaries ? boundaries.split(',') : [];

    axios
      .get(url, {
        headers: { Accept: 'application/json' },
      })
      .then(({ data: { rows } }) =>
        rows
          .map(row => {
            let bbox = null;
            try {
              bbox = JSON.parse(row.bbox);
              bbox = [bbox.slice(0, 2), bbox.slice(2, 4)];
              // eslint-disable-next-line no-empty
            } catch (e) {}

            return {
              ...omit(row, 'parent_id', 'parent_name', 'bbox'),
              parentId: row.parent_id,
              parentName: row.parent_name,
              bbox,
            };
          })
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
