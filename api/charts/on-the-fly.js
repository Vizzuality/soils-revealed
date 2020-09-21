const axios = require('axios').default;

const { LAYERS } = require('../../components/map/constants');
const { parseTimeseriesData, parseChangeData } = require('./helpers');

module.exports = ({ layer, type, depth, areaInterest }) => {
  const url = `${process.env.ANALYSIS_API_URL}`;

  const yearSetting = LAYERS[layer].paramsConfig.settings.type.options.find(
    option => option.value === type
  ).settings.year;

  const yearOptions = yearSetting ? yearSetting.options : null;

  const yearsValue = !yearOptions
    ? ['NoLU', '2010'] // Historic
    : [yearOptions[0].value, yearOptions[yearOptions.length - 1].value];

  const depthValue = LAYERS[layer].paramsConfig.settings.type.options
    .find(option => option.value === type)
    .settings.depth.options[depth].label.replace(/\scm/, '');

  const body = {
    dataset: layer === 'soc-stock' ? type : 'experimental',
    variable: layer === 'soc-stock' ? 'stocks' : type,
    years: yearsValue,
    depth: depthValue,
    geometry: areaInterest,
  };

  return axios
    .post(url, body, {
      headers: { Accept: 'application/json' },
    })
    .then(({ data: { counts, bins, mean_diff, mean_years, mean_values } }) => ({
      timeseries: parseTimeseriesData(mean_years, mean_values),
      change: parseChangeData(counts, bins, mean_diff),
    }));
};
