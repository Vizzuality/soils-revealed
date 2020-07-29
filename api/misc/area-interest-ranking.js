const axios = require('axios').default;

const { LAYERS } = require('../../components/map/constants');

module.exports = ({ params: { layer, type, boundaries, depth, order } }, res) => {
  try {
    const groupType = layer === 'soc-stock' ? type : 'experimental_dataset';
    const variable = layer === 'soc-stock' || type === 'stock' ? 'stocks' : 'concentration';
    const depthValue = LAYERS[layer].paramsConfig.settings.type.options
      .find(option => option.value === type)
      .settings.depth.options[depth].label.replace(/\scm/, '');

    const query = `
      with a as (
        SELECT id, name_0 as name, 'political-boundaries' as type, mean_diff, years, group_type, variable, depth
        FROM political_boundaries_change
        WHERE level = 0

        UNION

        SELECT 1 as id, maj_name as name, 'river-basins' as type, mean_diff, years, group_type, variable, depth
        FROM hydrological_basins_change
        WHERE level = 0

        UNION

        SELECT eco_id as id, eco_name as name, 'biomes' as type, mean_diff, years, group_type, variable, depth
        FROM biomes_change

        UNION

        SELECT ne_id as id, name as name, 'landforms' as type, mean_diff, years, group_type, variable, depth
        FROM landforms_change
      )

      SELECT id, name, mean_diff as value, years, variable, type
      FROM a
      WHERE group_type = '${groupType}' and variable = '${variable}' and depth = '${depthValue}' and type = '${boundaries}' and mean_diff is not null ORDER BY value ${order} LIMIT 50
    `;

    const url = encodeURI(`${process.env.API_URL}/sql?q=${query}`);

    axios
      .get(url, {
        headers: { Accept: 'application/json' },
      })
      .then(({ data: { rows } }) =>
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
