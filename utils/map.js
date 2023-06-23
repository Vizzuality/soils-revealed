import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';

dayjs.extend(dayOfYear);

const DATE_FORMAT = 'YYYY-MM-DD';

export const computeDecodeParams = (layer, { dateRange, currentDate }) => {
  const minDate = dayjs(layer.legend.timeline.minDate, DATE_FORMAT);
  const maxDate = dayjs(layer.legend.timeline.maxDate, DATE_FORMAT);

  const start = dayjs(dateRange[0], DATE_FORMAT).isBefore(minDate)
    ? minDate
    : dayjs(dateRange[0], DATE_FORMAT);
  const end = dayjs(dateRange[1], DATE_FORMAT).isAfter(maxDate)
    ? maxDate
    : dayjs(dateRange[1], DATE_FORMAT);
  const current = dayjs(currentDate, DATE_FORMAT).isAfter(maxDate)
    ? maxDate
    : dayjs(currentDate, DATE_FORMAT);

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

export const getLayerSource = (layerId, layer, layerSettings) => {
  let source;
  if (layerId === 'soc-experimental' || layerId === 'soc-stock') {
    source = layer.config.source(layerSettings);
  } else {
    source =
      typeof layer.config.source === 'function'
        ? layer.config.source(
            layerSettings.dateRange
              ? computeDecodeParams(layer, {
                  dateRange: layerSettings.dateRange,
                  currentDate: layerSettings.currentDate,
                }).endYear
              : undefined
          )
        : layer.config.source;
  }
  return source;
};

export const getLayerDef = (layerId, layer, layerSettings) => {
  const source = getLayerSource(layerId, layer, layerSettings);

  return {
    id: layerId,
    ...layer.config,
    source,
    opacity: layerSettings.opacity,
    visibility: layerSettings.visible,
    // We need to add 2: +1 because it can't be 0 and +1 to be on top of external basemaps
    zIndex: layerSettings.order + 2,
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
  };
};

export const getBoundariesDef = (boundariesId, boundaries, boundariesSettings) => ({
  id: boundariesId,
  type: boundaries.config.type,
  source: {
    ...boundaries.config.source,
  },
  opacity: boundariesSettings.opacity ?? 1,
  render: boundaries.config.render,
});

export const getAreaLayerDef = (area, compare) => {
  if (!area?.geo) {
    return null;
  }

  return {
    id: `custom-area-interest${compare ? '-compare' : ''}`,
    source: {
      type: 'geojson',
      data: area.geo,
    },
    type: 'geojson',
    render: {
      layers: [
        {
          type: 'line',
          paint: {
            'line-width': 2,
            'line-opacity': 1,
            'line-color': '#000000',
            ...(compare ? { 'line-dasharray': [2.5, 2.5] } : {}),
          },
          metadata: {
            position: 'top',
          },
        },
      ],
    },
    opacity: 1,
    visibility: true,
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

export const getLayerExtraParams = (layer, layerConfig) => {
  if (!layer.paramsConfig) {
    return undefined;
  }

  return {
    config: layer.paramsConfig,
    // We only support two levels of nesting otherwise we'd need to recurse
    ...Object.keys(layer.paramsConfig.settings).reduce((res, key) => {
      const setting = layer.paramsConfig.settings[key];

      if (setting.options) {
        const value = layerConfig[key] || layer.paramsConfig.settings[key].defaultOption;
        const { settings } = layer.paramsConfig.settings[key].options.find(
          option => option.value === value
        );

        return {
          ...res,
          [key]: value,
          ...Object.keys(settings ?? {}).reduce(
            (res2, key2) => ({
              ...res2,
              [key2]: layerConfig[key2] || settings[key2].defaultOption,
            }),
            {}
          ),
        };
      }

      if (setting.default !== undefined) {
        // If the layer is not visible, `layerConfig` will be `undefined`
        const value = (layerConfig && layerConfig[key]) || layer.paramsConfig.settings[key].default;

        return {
          ...res,
          [key]: value,
        };
      }

      return res;
    }, {}),
  };
};
