const getOnTheFlyData = require('./on-the-fly');
const getTimeseriesData = require('./timeseries');
const getChangeData = require('./change');
const { combineTimeseriesData, combineChangeData } = require('./helpers');

module.exports = async (
  {
    params: { layer, type, boundaries, depth },
    query: { scenario },
    body: { areaInterest, compareAreaInterest },
  },
  res
) => {
  try {
    let resData;

    const data =
      typeof areaInterest === 'object'
        ? await getOnTheFlyData({ layer, type, depth, areaInterest })
        : {
            timeseries: await getTimeseriesData({
              layer,
              type,
              boundaries,
              depth,
              areaInterest,
              scenario,
            }),
            change: await getChangeData({ layer, type, boundaries, depth, areaInterest, scenario }),
          };

    resData = data;

    if (compareAreaInterest) {
      const compareData =
        typeof compareAreaInterest === 'object'
          ? await getOnTheFlyData({
              layer,
              type,
              depth,
              areaInterest: compareAreaInterest,
            })
          : {
              timeseries: await getTimeseriesData({
                layer,
                type,
                boundaries,
                depth,
                areaInterest: compareAreaInterest,
                scenario,
              }),
              change: await getChangeData({
                layer,
                type,
                boundaries,
                depth,
                areaInterest: compareAreaInterest,
                scenario,
              }),
            };

      resData = {
        timeseries: combineTimeseriesData(data.timeseries, compareData.timeseries),
        change: combineChangeData(data.change, compareData.change),
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