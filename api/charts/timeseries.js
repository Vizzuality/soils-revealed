const axios = require('axios').default;

const { BOUNDARIES, LAYERS } = require('../../components/map/constants');

module.exports = ({ params: { layer, type, boundaries, depth, areaInterest } }, res) => {
  try {
    const table = `${BOUNDARIES[boundaries].table}_time_series`;
    const geoId = BOUNDARIES[boundaries].geoId;

    let query;
    if (layer === 'soc-stock') {
      const depthValue = LAYERS['soc-stock'].paramsConfig.settings.type.options
        .find(option => option.value === type)
        .settings.depth.options[depth].label.replace(/\scm/, '');

      query = `${process.env.API_URL}/sql?q=SELECT * FROM ${table} WHERE variable = 'stocks' AND depth = '${depthValue}' AND group_type = '${type}' AND ${geoId} = ${areaInterest}`;
    } else {
      const variable = type === 'concentration' ? type : 'stocks';
      const depthValue = LAYERS['soc-experimental'].paramsConfig.settings.type.options
        .find(option => option.value === type)
        .settings.depth.options[depth].label.replace(/\scm/, '');

      query = `${process.env.API_URL}/sql?q=SELECT * FROM ${table} WHERE variable = '${variable}' AND depth = '${depthValue}' AND group_type = 'experimental_dataset' AND ${geoId} = ${areaInterest}`;
    }

    axios
      .get(query, {
        headers: { Accept: 'application/json' },
      })
      .then(({ data: { rows } }) => {
        if (rows.length === 0) {
          return [];
        }

        const years = JSON.parse(rows[0].years);
        const values = rows[0].mean_values
          .replace(/(\\n|\[|\])/g, '')
          .replace(/\s+/g, ' ')
          .split(' ');

        return years.map((year, index) => ({
          year,
          value: +values[index],
        }));
      })
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
