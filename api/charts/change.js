const axios = require('axios').default;

const { BOUNDARIES, LAYERS } = require('../../components/map/constants');

const fetchData = ({ layer, type, boundaries, depth, areaInterest }) => {
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

  return axios
    .get(query, {
      headers: { Accept: 'application/json' },
    })
    .then(({ data: { rows } }) => {
      if (rows.length === 0) {
        return {};
      }

      const bins = rows[0].bins
        .replace(/(\\n|\[|\])/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(bin => +bin);

      const counts = rows[0].counts
        .replace(/(\\n|\[|\])/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(count => +count);

      const sumCounts = counts.reduce((res, count) => res + count, 0);
      const values = counts.map(count => (count / sumCounts) * 100);

      return {
        average: rows[0].mean_diff,
        rows: values.map((value, index) => ({
          value,
          bin: bins[index],
        })),
      };
    });
};

module.exports = async (
  { params: { layer, type, boundaries, depth, areaInterest }, query: { compare } },
  res
) => {
  try {
    let resData;

    const data = await fetchData({ layer, type, boundaries, depth, areaInterest });
    resData = data;

    if (compare) {
      const compareData = await fetchData({
        layer,
        type,
        boundaries,
        depth,
        areaInterest: compare,
      });

      const bins = [
        ...new Set([
          ...(data.rows || []).map(r => r.bin),
          ...(compareData.rows || []).map(r => r.bin),
        ]),
      ].sort((a, b) => a - b);

      resData = {
        ...data,
        compareAverage: compareData.average,
        rows: bins.map(bin => {
          const dataPoint = data.rows ? data.rows.find(d => d.bin === bin) : null;
          const compareDataPoint = compareData.rows
            ? compareData.rows.find(d => d.bin === bin)
            : null;
          return {
            bin,
            value: dataPoint ? dataPoint.value : null,
            compareValue: compareDataPoint ? compareDataPoint.value : null,
          };
        }),
      };
    }

    // We cache the results for 10 minutes
    res.set('Cache-Control', `public,max-age=${10 * 60}`);
    res.send({ data: resData });
  } catch (e) {
    console.log(e);
    res.status(404).end();
  }
};
