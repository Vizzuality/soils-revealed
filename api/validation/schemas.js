const Joi = require('joi');

const tileSchema = Joi.object({
  x: Joi.number()
    .integer()
    .min(0)
    .required(),
  y: Joi.number()
    .integer()
    .min(0)
    .required(),
  z: Joi.number()
    .integer()
    .min(0)
    .required(),
});

module.exports = {
  landCover: tileSchema.append({
    year: Joi.number()
      .integer()
      .min(2000)
      .max(2018)
      .required(),
  }),
  socExperimentalTimeseries: tileSchema.append({
    type: Joi.string()
      .allow('stock', 'concentration')
      .required(),
    depth: Joi.number()
      .integer()
      .min(0)
      .max(5)
      .required(),
    year: Joi.number()
      .integer()
      .min(1982)
      .max(2017)
      .required(),
  }),
  socExperimentalChange: tileSchema.append({
    type: Joi.string()
      .valid('stock', 'concentration')
      .required(),
    depth: Joi.number()
      .integer()
      .min(0)
      .max(5)
      .required(),
    year1: Joi.number()
      .integer()
      .min(1982)
      .max(2017)
      .max(Joi.ref('year2'))
      .required(),
    year2: Joi.number()
      .integer()
      .min(1982)
      .max(2017)
      .required(),
  }),
  socStockHistoricPeriod: tileSchema.append({
    depth: Joi.number()
      .integer()
      .min(0)
      .max(2)
      .required(),
    period: Joi.string()
      .valid('historic', 'current')
      .required(),
  }),
  socStockHistoricChange: tileSchema.append({
    depth: Joi.number()
      .integer()
      .min(0)
      .max(2)
      .required(),
  }),
  socStockRecentTimeseries: tileSchema.append({
    year: Joi.number()
      .integer()
      .min(2000)
      .max(2018)
      .required(),
  }),
  socStockRecentChange: tileSchema.append({
    year1: Joi.number()
      .integer()
      .min(2000)
      .max(2018)
      .max(Joi.ref('year2'))
      .required(),
    year2: Joi.number()
      .integer()
      .min(2000)
      .max(2018)
      .required(),
  }),
  socStockFuturePeriod: tileSchema.append({
    scenario: Joi.string()
      .valid('00', '01', '02', '03', '04', '10', '20', '21', '22')
      .required(),
    year: Joi.number()
      .integer()
      .valid(2023, 2028, 2033, 2038)
      .required(),
  }),
  socStockFutureChange: tileSchema.append({
    scenario: Joi.string()
      .valid('00', '01', '02', '03', '04', '10', '20', '21', '22')
      .required(),
    year: Joi.number()
      .integer()
      .valid(2023, 2028, 2033, 2038)
      .required(),
  }),
  timeseriesChart: Joi.object({
    layer: Joi.string()
      .valid('soc-stock', 'soc-experimental')
      .required(),
    type: Joi.string()
      .valid('historic', 'recent', 'future', 'concentration', 'stock')
      .required(),
    boundaries: Joi.string()
      .valid('political-boundaries', 'landforms', 'river-basins', 'biomes')
      .required(),
    depth: Joi.number()
      .integer()
      .min(0)
      .max(5)
      .required(),
    areaInterest: Joi.number()
      .integer()
      .min(0)
      .required(),
  }),
  timeseriesChartQuery: Joi.object({
    compare: Joi.number()
      .integer()
      .min(0),
  }),
  changeChart: Joi.object({
    layer: Joi.string()
      .valid('soc-stock', 'soc-experimental')
      .required(),
    type: Joi.string()
      .valid('historic', 'recent', 'future', 'concentration', 'stock')
      .required(),
    boundaries: Joi.string()
      .valid('political-boundaries', 'landforms', 'river-basins', 'biomes')
      .required(),
    depth: Joi.number()
      .integer()
      .min(0)
      .max(5)
      .required(),
    areaInterest: Joi.number()
      .integer()
      .min(0)
      .required(),
  }),
  changeChartQuery: Joi.object({
    compare: Joi.number()
      .integer()
      .min(0),
  }),
  areaInterestSearch: Joi.object({
    search: Joi.string().required(),
  }),
  areaInterestSearchQuery: Joi.object({
    boundaries: Joi.string().regex(
      /^(political-boundaries|landforms|river-basins|biomes)(,(political-boundaries|landforms|river-basins|biomes))*$/
    ),
  }),
  areaInterestRanking: Joi.object({
    layer: Joi.string()
      .valid('soc-stock', 'soc-experimental')
      .required(),
    type: Joi.string()
      .valid('historic', 'recent', 'future', 'concentration', 'stock')
      .required(),
    boundaries: Joi.string()
      .valid('political-boundaries', 'landforms', 'river-basins', 'biomes')
      .required(),
    depth: Joi.number()
      .integer()
      .min(0)
      .max(5)
      .required(),
    level: Joi.number()
      .integer()
      .min(0)
      .max(1)
      .required(),
    order: Joi.string()
      .valid('asc', 'desc')
      .required(),
    aggregation: Joi.string()
      .valid('average', 'total')
      .required(),
  }),
  areaInterestRankingQuery: Joi.object({
    within: Joi.number()
      .integer()
      .min(0),
  }),
};
