import moment from 'moment';

export const computeDecodeParams = (layer, { dateRange, currentDate }) => {
  const minDate = moment(layer.legend.timeline.minDate);
  const maxDate = moment(layer.legend.timeline.maxDate);

  const start = moment(dateRange[0]).isBefore(minDate) ? minDate : moment(dateRange[0]);
  const end = moment(dateRange[1]).isAfter(maxDate) ? maxDate : moment(dateRange[1]);
  const current = moment(currentDate).isAfter(maxDate) ? maxDate : moment(currentDate);

  const startDate = start;
  const endDate = current.isBefore(end) ? current : end;

  return {
    startYear: startDate.year(),
    startMonth: startDate.month(),
    startDay: startDate.dayOfYear(),
    endYear: endDate.year(),
    endMonth: endDate.month(),
    endDay: endDate.dayOfYear(),
  };
};

export const toggleBasemap = (map, basemap) => {
  const mapStyle = map.getStyle();
  const { layers } = mapStyle;
  const groups = mapStyle.metadata['mapbox:groups'];

  const basemapGroups = Object.keys(groups)
    .map(groupId => ({ [groupId]: groups[groupId].name }))
    .reduce((res, group) => {
      const groupId = Object.keys(group)[0];
      const groupName = group[groupId];

      if (!groupName.startsWith('basemap_')) {
        return res;
      }

      return {
        ...res,
        [groupId]: groupName,
      };
    }, {});

  const basemapGroupIds = Object.keys(basemapGroups);

  layers.forEach(layer => {
    const group = layer.metadata?.['mapbox:group'];

    if (group && basemapGroupIds.indexOf(group) !== -1) {
      map.setLayoutProperty(
        layer.id,
        'visibility',
        basemapGroups[group] === basemap.styleGroup ? 'visible' : 'none'
      );
    }
  });
};
