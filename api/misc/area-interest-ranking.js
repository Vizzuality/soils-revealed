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
        } as name, 'political-boundaries' as type, mean_diff, years, group_type, variable, depth, level, -1 as parent_id
        FROM political_boundaries_change

        UNION

        SELECT 1 as id, ${
          +level === 0 ? 'maj_name' : 'sub_name'
        } as name, 'river-basins' as type, mean_diff, years, group_type, variable, depth, level, -1 as parent_id
        FROM hydrological_basins_change

        UNION

        SELECT eco_id as id, eco_name as name, 'biomes' as type, mean_diff, years, group_type, variable, depth, 1 as level, -1 as parent_id
        FROM biomes_change

        UNION

        SELECT ne_id as id, name as name, 'landforms' as type, mean_diff, years, group_type, variable, depth, 1 as level, -1 as parent_id
        FROM landforms_change
      )

      SELECT id, name, mean_diff as value, years, variable, type, level
      FROM a
      WHERE level = ${level} and group_type = '${groupType}' and variable = '${variable}' and depth = '${depthValue}' and type = '${boundaries}' and mean_diff is not null${
      within ? ` and parent_id = ${within}` : ''
    } ORDER BY value ${order} LIMIT 50
    `;

    const url = encodeURI(`${process.env.API_URL}/sql?q=${query}`);

    axios
      .get(url, {
        headers: { Accept: 'application/json' },
      })
      .then(({ data: { rows } }) =>
        rows
          .map(({ id, name, value, type, years: rawYears, level }) => {
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
            };
          })
          // TODO: We don't have IDs for the river basins for now
          .filter(({ type }) => type !== 'river-basins')
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
