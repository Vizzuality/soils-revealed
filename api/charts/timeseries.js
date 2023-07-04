const axios = require('axios').default;

const { BOUNDARIES, LAYERS } = require('../../components/map/constants');
const { parseTimeseriesData } = require('./helpers');

const SCENARIOS = {
  '00': 'crop_MGI',
  '01': 'crop_I',
  '02': 'crop_MG',
  '03': 'grass_part',
  '04': 'grass_full',
  '10': 'rewilding',
  '20': 'degradation_NoDeforestation',
  '21': 'degradation_ForestToCrop',
  '22': 'degradation_ForestToGrass',
};

module.exports = ({ layer, type, boundaries, depth, areaInterest, scenario }) => {
  // There is no timeseries data for the historic section
  if (layer === 'soc-stock' && type !== 'recent' && type !== 'future') {
    return Promise.resolve([]);
  }

  const table = `${BOUNDARIES[boundaries].table}_time_series`;

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
  // that, we send a dummy parameter (here `t`), which contains today's date
  // In addition, we want to clean the cache each time we deploy, so we use another parameter, `d`,
  // which contains the deployment key
  query = `${query}&t=${new Date().toISOString().split('T')[0]}&d=${process.env.DEPLOYMENT_KEY}`;

  return axios
    .get(query, {
      headers: { Accept: 'application/json' },
    })
    .then(({ data: { rows } }) => {
      if (rows.length === 0) {
        return [];
      }

      const years = JSON.parse(rows[0].years);
      const values = rows[0].mean_values
        .replace(/(\\n|\[|\]|,)/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(value => +value);

      return parseTimeseriesData(years, values);
    });
};
