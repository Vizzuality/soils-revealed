/**
 * Parse the data of the timeseries chart
 * @param {number[]} years List of years
 * @param {number[]} values List of mean values for each year
 */
exports.parseTimeseriesData = (years, values) => {
  if (values.every(v => v === null)) {
    return null;
  }

  return years.map((year, index) => ({
    year,
    value: values[index],
  }));
};

/**
 * Parse the data of the change chart
 * @param {number[]} counts List of counts
 * @param {number[]} bins List of bins for each count
 * @param {number} average Mean difference
 * @param {number} area Area of the geometry in hectares
 */
exports.parseChangeData = (counts, bins, average, area) => {
  if (average === null) {
    return null;
  }

  const sumCounts = counts.reduce((res, count) => res + count, 0);
  const values = counts.map(count => (count / sumCounts) * 100);

  return {
    average,
    total: area ? average * area : null,
    rows: values.map((value, index) => ({
      value,
      bin: bins[index],
    })),
  };
};

/**
 * Combine two timeseries data sets
 * @param {ReturnType<typeof exports.parseTimeseriesData>} data Timeseries data
 * @param {ReturnType<typeof exports.parseTimeseriesData>} compareData Compare timeseries data
 */
exports.combineTimeseriesData = (data, compareData) => {
  if (data === null || compareData === null) {
    return null;
  }

  const years = [...new Set([...data.map(d => d.year), ...compareData.map(d => d.year)])].sort(
    (a, b) => a - b
  );

  return years.map(year => {
    const dataPoint = data.find(d => d.year === year);
    const compareDataPoint = compareData.find(d => d.year === year);
    return {
      year,
      value: dataPoint ? dataPoint.value : null,
      compareValue: compareDataPoint ? compareDataPoint.value : null,
    };
  });
};

/**
 * Combine two change data sets
 * @param {ReturnType<typeof exports.parseChangeData>} data Change data
 * @param {ReturnType<typeof exports.parseChangeData>} compareData Compare change data
 */
exports.combineChangeData = (data, compareData) => {
  if (data === null || compareData === null) {
    return null;
  }

  const bins = [
    ...new Set([...(data.rows || []).map(r => r.bin), ...(compareData.rows || []).map(r => r.bin)]),
  ].sort((a, b) => a - b);

  return {
    ...data,
    compareAverage: compareData.average,
    compareTotal: compareData.total,
    rows: bins.map(bin => {
      const dataPoint = data.rows ? data.rows.find(d => d.bin === bin) : null;
      const compareDataPoint = compareData.rows ? compareData.rows.find(d => d.bin === bin) : null;
      return {
        bin,
        value: dataPoint ? dataPoint.value : null,
        compareValue: compareDataPoint ? compareDataPoint.value : null,
      };
    }),
  };
};
