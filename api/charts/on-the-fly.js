const axios = require('axios').default;

const { LAYERS } = require('../../components/map/constants');
const { parseTimeseriesData, parseChangeData, parseChangeByLandCoverData } = require('./helpers');
const logger = require('../../logger');

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

module.exports = ({ layer, type, depth, areaInterest, scenario }) => {
  const url = `${process.env.ANALYSIS_API_URL}`;

  const yearSetting = LAYERS[layer].paramsConfig.settings.type.options.find(
    option => option.value === type
  ).settings.year;

  const yearOptions = yearSetting ? yearSetting.options : null;

  let yearsValue;
  if (!yearOptions) {
    yearsValue = ['NoLU', '2010']; // Historic
  } else {
    if (type !== 'future') {
      yearsValue = [yearOptions[0].value, yearOptions[yearOptions.length - 1].value];
    } else {
      const recentYearOptions = LAYERS['soc-stock'].paramsConfig.settings.type.options.find(
        option => option.value === 'recent'
      ).settings.year.options;

      yearsValue = [
        recentYearOptions[recentYearOptions.length - 1].value,
        yearOptions[yearOptions.length - 1].value,
      ];
    }
  }

  const depthValue = LAYERS[layer].paramsConfig.settings.type.options
    .find(option => option.value === type)
    .settings.depth.options[depth].label.replace(/\scm/, '');

  let dataset;
  if (layer !== 'soc-stock') {
    dataset = 'experimental';
  } else {
    dataset = type === 'future' ? SCENARIOS[scenario] : type;
  }

  const body = {
    dataset,
    variable: layer === 'soc-stock' || type === 'stock' ? 'stocks' : type,
    years: yearsValue,
    depth: depthValue,
    geometry: areaInterest,
  };

  logger.debug(`Loading OTF results with request POST ${url} ${JSON.stringify(body)}`);

  return axios
    .post(url, body, {
      headers: { Accept: 'application/json' },
    })
    .then(response => {
      logger.debug(
        `Successfully loaded OTF results: ${JSON.stringify({
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
        })}`
      );
      const {
        data: {
          data: {
            counts,
            bins,
            mean_diff,
            mean_years,
            mean_values,
            area_ha,
            land_cover,
            land_cover_groups,
            land_cover_group_2018,
          },
        },
      } = response;

      const landCoverMainClasses = land_cover_groups || {};
      const landCoverMainClassesBreakdown =
        (type === 'future' ? land_cover : land_cover_group_2018) || {};
      const landCoverSubClasses = (type === 'future' ? {} : land_cover) || {};

      return {
        timeseries: parseTimeseriesData(mean_years, mean_values),
        change: parseChangeData(counts, bins, mean_diff, area_ha),
        changeByLandCover: parseChangeByLandCoverData(
          type === 'future',
          landCoverMainClasses,
          landCoverMainClassesBreakdown,
          landCoverSubClasses
        ),
      };
    })
    .catch(error => {
      logger.warn(`Error loading and parsing the OTF results: ${error.toString()}`);
    });
};
