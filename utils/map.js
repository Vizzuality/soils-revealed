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

export const getLayerDef = (layerId, layer, layerSettings) => ({
  id: layerId,
  ...layer.config,
  source:
    typeof layer.config.source === 'function'
      ? layer.config.source(
          layerSettings.dateRange
            ? computeDecodeParams(layer, {
                dateRange: layerSettings.dateRange,
                currentDate: layerSettings.currentDate,
              }).endYear
            : undefined
        )
      : layer.config.source,
  opacity: layerSettings.opacity,
  visibility: layerSettings.visible,
  zIndex: layerSettings.order + 1,
  ...(layer.decodeParams
    ? {
        decodeParams: {
          ...layer.decodeParams,
          ...(layerSettings.dateRange
            ? computeDecodeParams(layer, {
                dateRange: layerSettings.dateRange,
                currentDate: layerSettings.currentDate,
              })
            : {}),
        },
      }
    : {}),
  ...(layer.decodeFunction ? { decodeFunction: layer.decodeFunction } : {}),
});

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

export const toggleLabels = (map, basemap, showLabels) => {
  const mapStyle = map.getStyle();
  const { layers } = mapStyle;
  const groups = mapStyle.metadata['mapbox:groups'];

  const labelsGroups = Object.keys(groups)
    .map(groupId => ({ [groupId]: groups[groupId].name }))
    .reduce((res, group) => {
      const groupId = Object.keys(group)[0];
      const groupName = group[groupId];

      if (!groupName.startsWith('labels_')) {
        return res;
      }

      return {
        ...res,
        [groupId]: groupName,
      };
    }, {});

  const labelsGroupIds = Object.keys(labelsGroups);
  const activeLabelsGroup =
    basemap === 'dark' || basemap === 'satellite' || basemap === 'landsat'
      ? 'labels_light'
      : 'labels_dark';

  layers.forEach(layer => {
    const group = layer.metadata?.['mapbox:group'];

    if (group && labelsGroupIds.indexOf(group) !== -1) {
      map.setLayoutProperty(
        layer.id,
        'visibility',
        showLabels && labelsGroups[group] === activeLabelsGroup ? 'visible' : 'none'
      );
    }
  });
};

export const toggleRoads = (map, showRoads) => {
  const mapStyle = map.getStyle();
  const { layers } = mapStyle;
  const groups = mapStyle.metadata['mapbox:groups'];

  const roadsGroups = Object.keys(groups)
    .map(groupId => ({ [groupId]: groups[groupId].name }))
    .reduce((res, group) => {
      const groupId = Object.keys(group)[0];
      const groupName = group[groupId];

      if (groupName !== 'roads') {
        return res;
      }

      return {
        ...res,
        [groupId]: groupName,
      };
    }, {});

  const roadsGroupIds = Object.keys(roadsGroups);

  layers.forEach(layer => {
    const group = layer.metadata?.['mapbox:group'];

    if (group && roadsGroupIds.indexOf(group) !== -1) {
      map.setLayoutProperty(layer.id, 'visibility', showRoads ? 'visible' : 'none');
    }
  });
};
