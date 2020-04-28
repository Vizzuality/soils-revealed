import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import ReactMapGL, { TRANSITION_EVENTS } from 'react-map-gl';
import { fitBounds } from 'viewport-mercator-project';

import './style.scss';

const DEFAULT_VIEWPORT = {
  zoom: 2,
  latitude: 0,
  longitude: 0,
};

class Map extends Component {
  HOVER = {};
  CLICK = {};

  static propTypes = {
    /** A function that returns the map instance */
    children: PropTypes.func,

    /** Custom css class for styling */
    customClass: PropTypes.string,

    /** An object that defines the viewport
     * @see https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map?section=initialization
     */
    viewport: PropTypes.shape({}),

    /** An object that defines the bounds */
    bounds: PropTypes.shape({
      bbox: PropTypes.arrayOf(PropTypes.array),
      duration: PropTypes.number,
      options: PropTypes.shape({}),
    }),

    /** A boolean that allows panning */
    dragPan: PropTypes.bool,

    /** A boolean that allows rotating */
    dragRotate: PropTypes.bool,

    /** A boolean that allows zooming */
    scrollZoom: PropTypes.bool,

    /** A boolean that allows zooming */
    touchZoom: PropTypes.bool,

    /** A boolean that allows touch rotating */
    touchRotate: PropTypes.bool,

    /** A boolean that allows double click zooming */
    doubleClickZoom: PropTypes.bool,

    /** A function that exposes when the map is ready. It returns and object with the `this.map` and `this.mapContainer` reference. */
    onReady: PropTypes.func,

    /** A function that exposes when the map is loaded. It returns and object with the `this.map` and `this.mapContainer` reference. */
    onLoad: PropTypes.func,

    /** A function that exposes the viewport */
    onViewportChange: PropTypes.func,

    /** A function that exposes hovering features. */
    onHover: PropTypes.func,

    /** A function that exposes mouseleave from features. */
    onMouseLeave: PropTypes.func,

    /** A function that exposes the viewport */
    getCursor: PropTypes.func,
  };

  static defaultProps = {
    children: null,
    customClass: null,
    viewport: DEFAULT_VIEWPORT,
    bounds: {},
    dragPan: true,
    dragRotate: true,

    onViewportChange: () => {},
    onLoad: () => {},
    onReady: () => {},
    getCursor: ({ isHovering, isDragging }) => {
      if (isHovering) return 'pointer';
      if (isDragging) return 'grabbing';
      return 'grab';
    },
  };

  state = {
    viewport: {
      ...DEFAULT_VIEWPORT,
      ...this.props.viewport, // eslint-disable-line
    },
    flying: false,
    loaded: false,
    size: {
      width: 0,
      height: 0,
    },
  };

  componentDidMount() {
    this.onReady();
  }

  componentDidUpdate(prevProps, prevState) {
    const { viewport: prevViewport, bounds: prevBounds } = prevProps;
    const { viewport, bounds } = this.props;

    const { size: prevSize } = prevState;
    const { size, viewport: stateViewport } = this.state;

    if (
      !isEmpty(bounds) &&
      !isEqual(bounds, prevBounds) &&
      !!bounds.bbox &&
      bounds.bbox.every(b => !!b) &&
      size.width !== 0 &&
      size.height !== 0
    ) {
      this.fitBounds();
    }

    if (!isEmpty(bounds) && !isEqual(size, prevSize)) {
      this.fitBounds();
    }

    if (!isEqual(viewport, prevViewport)) {
      this.setState({
        // eslint-disable-line
        viewport: {
          ...stateViewport,
          ...viewport,
        },
      });
    }
  }

  onReady = () => {
    const { onReady } = this.props;

    this.setState({
      size: {
        width: this.mapContainer && this.mapContainer.offsetWidth,
        height: this.mapContainer && this.mapContainer.offsetHeight,
      },
    });

    onReady({
      map: this.map,
      mapContainer: this.mapContainer,
    });
  };

  onLoad = () => {
    const { onLoad } = this.props;

    this.setState({
      loaded: true,
      size: {
        width: this.mapContainer && this.mapContainer.offsetWidth,
        height: this.mapContainer && this.mapContainer.offsetHeight,
      },
    });

    onLoad({
      map: this.map,
      mapContainer: this.mapContainer,
    });

    // We trigger a viewport change to send the intial bounds
    const { onViewportChange } = this.props;
    const { viewport } = this.state;
    const bounds = this.map?.getBounds().toArray();
    onViewportChange({ ...viewport, bounds });
  };

  onViewportChange = v => {
    const { onViewportChange } = this.props;
    const bounds = this.map?.getBounds().toArray();
    const viewport = {
      ...v,
      ...(bounds
        ? {
            bounds,
          }
        : {}),
    };

    this.setState({ viewport });
    onViewportChange(viewport);
  };

  onResize = v => {
    const { onViewportChange } = this.props;
    const { viewport } = this.state;
    const bounds = this.map?.getBounds().toArray();

    const newViewport = {
      ...viewport,
      ...v,
      ...(bounds
        ? {
            bounds,
          }
        : {}),
    };

    this.setState({ viewport: newViewport });
    onViewportChange(newViewport);
  };

  onMoveEnd = () => {
    const { onViewportChange } = this.props;
    const { viewport } = this.state;

    if (this.map) {
      const bearing = this.map.getBearing();
      const pitch = this.map.getPitch();
      const zoom = this.map.getZoom();
      const { lng, lat } = this.map.getCenter();
      const bounds = this.map?.getBounds().toArray();

      const newViewport = {
        ...viewport,
        bearing,
        pitch,
        zoom,
        latitude: lat,
        longitude: lng,
        ...(bounds
          ? {
              bounds,
            }
          : {}),
      };

      // Publish new viewport and save it into the state
      this.setState({ viewport: newViewport });
      onViewportChange(newViewport);
    }
  };

  onHover = e => {
    const { onHover } = this.props;
    const { features } = e;
    if (features && features.length) {
      const { id, source, sourceLayer } = features[0];

      if (this.HOVER.id) {
        this.map.setFeatureState(
          {
            ...this.HOVER,
          },
          { hover: false }
        );
      }

      if (id && source) {
        this.HOVER = {
          id,
          source,
          ...(sourceLayer && { sourceLayer }),
        };

        this.map.setFeatureState(
          {
            ...this.HOVER,
          },
          { hover: true }
        );
      }
    }

    !!onHover && onHover(e);
  };

  onMouseLeave = e => {
    const { onMouseLeave } = this.props;
    if (this.HOVER.id) {
      this.map.setFeatureState(
        {
          ...this.HOVER,
        },
        { hover: false }
      );
    }

    this.HOVER = {};

    !!onMouseLeave && onMouseLeave(e);
  };

  fitBounds = () => {
    const { bounds, onViewportChange } = this.props;
    const { bbox, duration, options } = bounds;

    const { longitude, latitude, zoom } = fitBounds({
      width: this.mapContainer.offsetWidth,
      height: this.mapContainer.offsetHeight,
      bounds: bbox,
      ...options,
    });

    const transitionDuration = duration !== undefined && duration !== null ? duration : 2500;

    const newViewport = {
      ...this.state.viewport,
      longitude,
      latitude,
      zoom,
      transitionDuration,
      transitionInterruption: TRANSITION_EVENTS.UPDATE,
      bounds: bbox,
    };

    this.setState({
      flying: true,
      viewport: newViewport,
    });
    onViewportChange(newViewport);

    setTimeout(() => {
      this.setState({ flying: false });
    }, transitionDuration);
  };

  render() {
    const {
      customClass,
      children,
      getCursor,
      dragPan,
      scrollZoom,
      touchZoom,
      touchRotate,
      doubleClickZoom,
      ...mapboxProps
    } = this.props;
    const { viewport, loaded, flying } = this.state;

    return (
      <div
        ref={r => {
          this.mapContainer = r;
        }}
        className={classnames({
          'c-map': true,
          [customClass]: !!customClass,
        })}
      >
        <ReactMapGL
          ref={map => {
            this.map = map && map.getMap();
          }}
          mapboxApiAccessToken={process.env.MAPBOX_API_KEY}
          // CUSTOM PROPS FROM REACT MAPBOX API
          {...mapboxProps}
          // VIEWPORT
          {...viewport}
          width="100%"
          height="100%"
          maxPitch={0}
          dragRotate={false}
          // INTERACTIVE
          dragPan={!flying && dragPan}
          scrollZoom={!flying && scrollZoom}
          touchZoom={!flying && touchZoom}
          touchRotate={!flying && touchRotate}
          doubleClickZoom={!flying && doubleClickZoom}
          // DEFAULT FUNC IMPLEMENTATIONS
          onViewportChange={this.onViewportChange}
          onResize={this.onResize}
          onLoad={this.onLoad}
          onHover={this.onHover}
          onMouseLeave={this.onMouseLeave}
          getCursor={getCursor}
        >
          {loaded && !!this.map && typeof children === 'function' && children(this.map)}
        </ReactMapGL>
      </div>
    );
  }
}

export default Map;
