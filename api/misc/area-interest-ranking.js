const axios = require('axios').default;

const { LAYERS } = require('../../components/map/constants');

module.exports = (
  { params: { layer, type, boundaries, depth, level, order }, query: { within } },
  res
) => {
  try {
    const groupType = layer === 'soc-stock' ? type : 'experimental_dataset';
    const variable = layer === 'soc-stock' || type === 'stock' ? 'stocks' : 'concentration';
    const depthValue = LAYERS[layer].paramsConfig.settings.type.options
      .find(option => option.value === type)
      .settings.depth.options[depth].label.replace(/\scm/, '');

    const query = `
      with a as (
        SELECT id, ${
          +level === 0 ? 'name_0' : 'name_1'
        } as name, 'political-boundaries' as type, mean_diff, years, group_type, variable, depth, level, name_0 as parent_name, id_0 as parent_id
        FROM political_boundaries_change

        UNION

        SELECT id, ${
          +level === 0 ? 'maj_name' : 'sub_name'
        } as name, 'river-basins' as type, mean_diff, years, group_type, variable, depth, level, maj_name as parent_name, id_0 as parent_id
        FROM hydrological_basins_change

        UNION

        SELECT id, ${
          +level === 0 ? 'biome_name' : 'eco_name'
        } as name,'biomes' as type, mean_diff, years, group_type, variable, depth, level, biome_name as parent_name, id_0 as parent_id
        FROM biomes_change

        UNION

        SELECT id, ${
          +level === 0 ? 'featurecla' : 'name'
        } as name, 'landforms' as type, mean_diff, years, group_type, variable, depth, level, featurecla as parent_name, id_0 as parent_id
        FROM landforms_change
      )

      SELECT id, name, mean_diff as value, years, variable, type, level, parent_name, parent_id
      FROM a
      WHERE level = ${level} and group_type = '${groupType}' and variable = '${variable}' and depth = '${depthValue}' and type = '${boundaries}' and mean_diff is not null${
      within ? ` and parent_id = ${within}` : ''
    } ORDER BY value ${order} LIMIT 50
    `;

    // Carto may incorrectly cache the data (the cache is not cleaned when data changes) so to avoid
    // that, we send a dummy parameter (here `d`), which contains today's date
    const url = encodeURI(
      `${process.env.API_URL}/sql?q=${query}&d=${new Date().toISOString().split('T')[0]}`
    );

    axios
      .get(url, {
        headers: { Accept: 'application/json' },
      })
      .then(({ data: { rows } }) =>
        rows.map(
          ({
            id,
            name,
            value,
            type,
            years: rawYears,
            level,
            parent_id: parentId,
            parent_name: parentName,
          }) => {
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
              level,
              parentId,
              parentName,
            };
          }
        )
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
