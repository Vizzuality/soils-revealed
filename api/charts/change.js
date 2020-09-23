const axios = require('axios').default;

const { BOUNDARIES, LAYERS } = require('../../components/map/constants');
const { parseChangeData } = require('./helpers');

const SCENARIOS = {
  '00': 'crop_MGI',
  '01': 'crop_I',
  '02': 'crop_MG',
  '03': 'grass_full',
  '04': 'grass_part',
  '10': 'rewilding',
  '20': 'degradation_NoDeforestation',
  '21': 'degradation_ForestToCrop',
  '22': 'degradation_ForestToGrass',
};

module.exports = ({ layer, type, boundaries, depth, areaInterest, scenario }) => {
  const table = `${BOUNDARIES[boundaries].table}_change`;

  let query;
  if (layer === 'soc-stock') {
    const depthValue = LAYERS['soc-stock'].paramsConfig.settings.type.options
      .find(option => option.value === type)
      .settings.depth.options[depth].label.replace(/\scm/, '');

    query = `${
      process.env.API_URL
    }/sql?q=SELECT * FROM ${table} WHERE variable = 'stocks' AND depth = '${depthValue}' AND group_type = '${
      type === 'future' ? SCENARIOS[scenario] : type
    }' AND id = ${areaInterest}`;
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

      return parseChangeData(
        counts,
        bins,
        rows[0].mean_diff,
        // We don't want to compute a total change value for the concentration because the average
        // value is not per ha
        type === 'concentration' ? null : rows[0].area_ha
      );
    });
};
