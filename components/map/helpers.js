import { WebMercatorViewport } from 'react-map-gl';

/**
 * Return the new viewport of the map after it has fit bounds
 * @param {number} mapWidth Width of the map
 * @param {number} mapHeight Height of the map
 * @param {any} viewport Current viewport of the map
 * @param {import('viewport-mercator-project').Bounds} bounds Bounds to fit to
 * @param {any} [options] See http://visgl.github.io/react-map-gl/docs/api-reference/web-mercator-viewport#fitboundsbounds-options
 */
export const getViewportFromBounds = (mapWidth, mapHeight, viewport, bounds, options) => {
  const { latitude, longitude, zoom } = new WebMercatorViewport({
    ...viewport,
    width: mapWidth,
    height: mapHeight,
  }).fitBounds(bounds, options);

  return { ...viewport, latitude, longitude, zoom, bounds };
};
