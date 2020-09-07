import { WebMercatorViewport } from 'react-map-gl';

/**
 * Return the new viewport of the map after it has fit bounds
 * @param {number} mapWidth Width of the map
 * @param {number} mapHeight Height of the map
 * @param {any} viewport Current viewport of the map
 * @param {number[][]} bounds Bounds to fit to
 * @param {any} [options] See http://visgl.github.io/react-map-gl/docs/api-reference/web-mercator-viewport#fitboundsbounds-options
 */
export const getViewportFromBounds = (mapWidth, mapHeight, viewport, bounds, options) => {
  const { latitude, longitude, zoom } = new WebMercatorViewport({
    ...viewport,
    width: mapWidth,
    height: mapHeight,
  }).fitBounds(/** @type {import('viewport-mercator-project').Bounds} */ (bounds), options);

  return { ...viewport, latitude, longitude, zoom, bounds };
};

/**
 * Combine several bounds into one
 * @param  {...number[][]} boundsArray Bounds to combine
 */
export const combineBounds = (...boundsArray) => [
  [
    Math.min(...boundsArray.map(bounds => bounds[0][0])),
    Math.min(...boundsArray.map(bounds => bounds[0][1])),
  ],
  [
    Math.max(...boundsArray.map(bounds => bounds[1][0])),
    Math.max(...boundsArray.map(bounds => bounds[1][1])),
  ],
];
