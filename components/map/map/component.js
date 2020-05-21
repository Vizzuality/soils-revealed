import React, { forwardRef, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { StaticMap } from 'react-map-gl';
import composeRefs from '@seznam/compose-react-refs';

import './style.scss';

const DEFAULT_VIEWPORT = {
  zoom: 2,
  latitude: 0,
  longitude: 0,
};

const Comp = (
  { className, isStatic, viewport, mapStyle, onLoad, onViewportChange, children, ...rest },
  ref
) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [previousViewport, setPreviousViewport] = useState(viewport);
  const [internalViewport, setInternalViewport] = useState(viewport);

  const ReactMap = isStatic ? StaticMap : ReactMapGL;
  const inner = useMemo(() => {
    if (typeof children === 'function') {
      if (loaded) {
        return children(map.current.getMap());
      } else {
        return null;
      }
    } else {
      return children;
    }
  }, [children, map, loaded]);

  const onLoadMap = useCallback(() => {
    onLoad(map.current.getMap());
    setLoaded(true);
  }, [onLoad, map.current, setLoaded]);

  const onChangeViewport = useCallback(
    v => {
      setInternalViewport(v);
      onViewportChange({
        ...v,
        ...(loaded
          ? {
              bounds: map.current
                .getMap()
                .getBounds()
                .toArray(),
            }
          : {}),
      });
    },
    [loaded, map.current, setInternalViewport, onViewportChange]
  );

  useEffect(() => {
    if (viewport !== previousViewport) {
      setInternalViewport(v => ({ ...v, ...viewport }));
      setPreviousViewport(viewport);
    }
  }, [viewport, previousViewport, setPreviousViewport, setInternalViewport]);

  return (
    <div ref={mapContainer} className={['c-map', ...(className ? [className] : [])].join(' ')}>
      <ReactMap
        ref={composeRefs(map, ref)}
        mapboxApiAccessToken={process.env.MAPBOX_API_KEY}
        width="100%"
        height="100%"
        mapStyle={mapStyle}
        {...internalViewport}
        {...(isStatic
          ? {}
          : { maxPitch: 0, dragRotate: false, onViewportChange: onChangeViewport })}
        onLoad={onLoadMap}
        {...rest}
      >
        {inner}
      </ReactMap>
    </div>
  );
};

const Map = forwardRef(Comp);

Map.displayName = 'Map';

Map.propTypes = {
  className: PropTypes.string,
  isStatic: PropTypes.bool,
  viewport: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
  }),
  mapStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onLoad: PropTypes.func,
  onViewportChange: PropTypes.func,
};

Map.defaultProps = {
  className: undefined,
  isStatic: false,
  viewport: DEFAULT_VIEWPORT,
  mapboxStyle: undefined,
  children: undefined,
  onLoad: undefined,
  onViewportChange: undefined,
};

export default Map;
