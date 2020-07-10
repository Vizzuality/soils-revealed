export const fetchChartData = async ({ table, geoId, areaInterest, depth, variable, group }) => {
  const res = await fetch(
    `${
      process.env.API_URL
    }/sql?q=SELECT * FROM ${table}_time_series WHERE variable = '${variable}' AND depth = '${depth.label.replace(
      /\scm/,
      ''
    )}' AND group_type = '${group}' AND ${geoId} = ${areaInterest.id}`
  );
  const { rows } = await res.json();

  if (rows.length === 0) {
    return [];
  }

  const years = JSON.parse(rows[0].years);
  const values = rows[0].mean_values
    .replace(/(\\n|\[|\])/g, '')
    .replace(/\s+/g, ' ')
    .split(' ');

  return years.map((year, index) => ({
    year,
    value: +values[index],
  }));
};
