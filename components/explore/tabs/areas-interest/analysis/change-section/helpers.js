export const fetchChartData = async ({ table, geoId, areaInterest, depth, variable, group }) => {
  const res = await fetch(
    `${
      process.env.API_URL
    }/sql?q=SELECT * FROM ${table}_change WHERE variable = '${variable}' AND depth = '${depth.label.replace(
      /\scm/,
      ''
    )}' AND group_type = '${group}' AND ${geoId} = ${areaInterest.id}`
  );
  const { rows } = await res.json();

  if (rows.length === 0) {
    return [];
  }

  const bins = rows[0].bins
    .replace(/(\\n|\[|\])/g, '')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(bin => +bin);

  const counts = rows[0].counts
    .replace(/(\\n|\[|\])/g, '')
    .replace(/\s+/g, ' ')
    .split(' ');
  const sumCounts = counts.reduce((res, count) => res + +count, 0);
  const values = counts.map(count => (+count / sumCounts) * 100);

  return values.map((value, index) => ({
    value,
    bin: bins[index],
  }));
};
