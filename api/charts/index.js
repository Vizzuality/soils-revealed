const getOnTheFlyData = require('./on-the-fly');
const getTimeseriesData = require('./timeseries');
const getChangeData = require('./change');
const getChangeByLandCoverData = require('./change-by-land-cover');
const {
  combineTimeseriesData,
  combineChangeData,
  combineChangeByLandCoverData,
} = require('./helpers');

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
        ? await getOnTheFlyData({ layer, type, depth, areaInterest, scenario })
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
            changeByLandCover: await getChangeByLandCoverData({
              layer,
              type,
              boundaries,
              areaInterest,
              scenario,
            }),
          };

    resData = data;

    if (compareAreaInterest !== null && compareAreaInterest !== undefined) {
      const compareData =
        typeof compareAreaInterest === 'object'
          ? await getOnTheFlyData({
              layer,
              type,
              depth,
              areaInterest: compareAreaInterest,
              scenario,
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
              changeByLandCover: await getChangeByLandCoverData({
                layer,
                type,
                boundaries,
                areaInterest: compareAreaInterest,
                scenario,
              }),
            };

      resData = {
        timeseries: combineTimeseriesData(data.timeseries, compareData.timeseries),
        change: combineChangeData(data.change, compareData.change),
        changeByLandCover: combineChangeByLandCoverData(
          data.changeByLandCover,
          compareData.changeByLandCover
        ),
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
