const axios = require('axios').default;

const { BOUNDARIES, LAYERS } = require('../../components/map/constants');
const { parseChangeData } = require('./helpers');

module.exports = ({ layer, type, boundaries, depth, areaInterest }) => {
  const table = `${BOUNDARIES[boundaries].table}_change`;

  let query;
  if (layer === 'soc-stock') {
    const depthValue = LAYERS['soc-stock'].paramsConfig.settings.type.options
      .find(option => option.value === type)
      .settings.depth.options[depth].label.replace(/\scm/, '');

    query = `${process.env.API_URL}/sql?q=SELECT * FROM ${table} WHERE variable = 'stocks' AND depth = '${depthValue}' AND group_type = '${type}' AND id = ${areaInterest}`;
  } else {
    const variable = type === 'concentration' ? type : 'stocks';
    const depthValue = LAYERS['soc-experimental'].paramsConfig.settings.type.options
      .find(option => option.value === type)
      .settings.depth.options[depth].label.replace(/\scm/, '');

    query = `${process.env.API_URL}/sql?q=SELECT * FROM ${table} WHERE variable = '${variable}' AND depth = '${depthValue}' AND group_type = 'experimental_dataset' AND id = ${areaInterest}`;
  }

  // Carto may incorrectly cache the data (the cache is not cleaned when data changes) so to avoid
  // that, we send a dummy parameter (here `d`), which contains today's date
  query = `${query}&d=${new Date().toISOString().split('T')[0]}`;

  return axios
    .get(query, {
      headers: { Accept: 'application/json' },
    })
    .then(({ data: { rows } }) => {
      if (rows.length === 0) {
        return {
          average: null,
          rows: [],
        };
      }

      const bins = rows[0].bins
        .replace(/(\\n|\[|\]|,)/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(bin => +bin);

      const counts = rows[0].counts
        .replace(/(\\n|\[|\]|,)/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(count => +count);

      return parseChangeData(counts, bins, rows[0].mean_diff);
    });
};
