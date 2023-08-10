const axios = require('axios').default;

const { BOUNDARIES } = require('../../components/map/constants');
const { parseChangeByLandCoverData } = require('./helpers');

module.exports = ({ layer, type, boundaries, areaInterest, scenario }) => {
  // There is no timeseries data for the historic section or the experimental dataset
  if ((layer === 'soc-stock' && type !== 'recent' && type !== 'future') || layer !== 'soc-stock') {
    return Promise.resolve([]);
  }

  const table = `${BOUNDARIES[boundaries].table}_land_cover`;

  let query = `${process.env.API_URL}/sql?q=SELECT * FROM ${table} WHERE group_type = '${type}' AND id = ${areaInterest}`;

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

      const landCoverMainClasses = JSON.parse(rows[0].land_cover_groups.replace(/'/g, '"'));
      const landCoverMainClassesBreakdown =
        type === 'future'
          ? JSON.parse(rows[0].land_cover.replace(/'/g, '"'))
          : JSON.parse(rows[0].land_cover_group_2018.replace(/'/g, '"'));
      const landCoverSubClasses =
        type === 'future' ? {} : JSON.parse(rows[0].land_cover.replace(/'/g, '"'));

      return parseChangeByLandCoverData(
        type === 'future',
        landCoverMainClasses,
        landCoverMainClassesBreakdown,
        landCoverSubClasses
      );
    });
};
