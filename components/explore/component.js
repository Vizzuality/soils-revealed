import React, { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import debounce from 'lodash/debounce';
import throttle from 'lodash/debounce';

import { Router } from 'lib/routes';
import { useHasMounted, useDesktop } from 'utils/hooks';
import { toggleBasemap, toggleLabels, toggleRoads } from 'utils/map';
import {
  Map,
  LayerManager,
  Controls,
  Legend,
  DrawEditor,
  BASEMAPS,
  BOUNDARIES,
  LAYERS,
  mapStyle,
  getViewportFromBounds,
} from 'components/map';
import FullscreenMessage from './fullscreen-message';
import Tabs from './tabs';
import ExperimentalDatasetToggle from './experimental-dataset-toggle';
import Attributions from './attributions';
import InfoModal from './info-modal';
import InteractiveFeaturePopup from './interactive-feature-popup';
import DrawBoard from './draw-board';
import MapContainer from './map-container';

import './style.scss';

// Non essential component and causes issues in SSR
const Tour = dynamic(() => import('./tour'), { ssr: false });

const Explore = ({
  zoom,
  acceptableMinZoom,
  acceptableMaxZoom,
  viewport,
  basemap,
  basemapParams,
  roads,
  labels,
  featureStates,
  activeDataLayers,
  activeLayersDef,
  activeLayersInteractiveIds,
  legendDataLayers,
  drawing,
  serializedState,
  restoreState,
  updateZoom,
  updateViewport,
  updateBasemap,
  updateBasemapParams,
  updateRoads,
  updateLabels,
  removeLayer,
  updateLayer,
  updateLayerOrder,
  updateBoundaries,
}) => {
  const hasMounted = useHasMounted();
  const isDesktop = useDesktop();
  const mapRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const map = useMemo(() => mapRef.current?.getMap(), [mapRef.current]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [infoLayer, setInfoLayer] = useState(null);
  const [previousSOCLayer, setPreviousSOCLayer] = useState(
    activeDataLayers.find(layer => LAYERS[layer].group === 'soc')
  );
  const [interactiveFeatures, setInteractiveFeatures] = useState(null);

  // When the user clicks the popup's button that triggers its close, the map also receives the
  // event and it opens a new popup right after
  // This is a bug of react-map-gl's library
  // To work around this issue, the setInteractiveFeatures function is throttle by a few hundred
  // milliseconds so that when the popup is closed, the click event received by the map can't open
  // a new one straight away
  const setInteractiveFeaturesThrottled = useCallback(
    throttle(setInteractiveFeatures, 300, { leading: true, trailing: false }),
    [setInteractiveFeatures]
  );

  const onChangeViewport = useCallback(
    // @ts-ignore
    debounce(v => {
      updateViewport({
        zoom: v.zoom,
        latitude: v.latitude,
        longitude: v.longitude,
        bounds: v.bounds,
      });
    }, 500),
    [updateViewport]
  );

  const onLoadMap = useCallback(
    m => {
      setMapLoaded(true);
      toggleBasemap(m, BASEMAPS[basemap]);
      toggleLabels(m, basemap, labels);
      toggleRoads(m, roads);
    },
    [basemap, labels, roads]
  );

  const onClickMap = useCallback(
    e => {
      const { lngLat, features } = e;

      if (features.length) {
        setInteractiveFeaturesThrottled({
          lat: lngLat[1],
          lng: lngLat[0],
          properties: features.map(feature => ({ ...feature.properties, id: feature.id })),
        });
      } else {
        setInteractiveFeaturesThrottled(null);
      }
    },
    [setInteractiveFeaturesThrottled]
  );

  const onChangeLayerSettings = useCallback(
    obj => {
      const isBoundariesLayer = Object.keys(BOUNDARIES).indexOf(obj.id) !== -1;
      const updater = isBoundariesLayer ? updateBoundaries : updateLayer;
      updater(obj);
    },
    [updateLayer, updateBoundaries]
  );

  // When the component is mounted, we restore its state from the URL
  useEffect(() => {
    restoreState();
  }, [restoreState]);

  // Each time the serialized state of the component changes, we update the URL
  useEffect(() => {
    Router.replaceRoute('explore', { state: serializedState });
  }, [serializedState]);

  // If the user toggles on some layer that has a restricted zoom range and the current zoom is
  // outside of it, we need to update the zoom to the min or max acceptable value
  useEffect(() => {
    if (zoom < acceptableMinZoom) {
      updateZoom(acceptableMinZoom);
    }

    if (zoom > acceptableMaxZoom) {
      updateZoom(acceptableMaxZoom);
    }
  }, [zoom, acceptableMinZoom, acceptableMaxZoom, updateZoom]);

  // When the basemap, labels or roads change, we update the map style
  useEffect(() => {
    if (map && mapLoaded) {
      toggleBasemap(map, BASEMAPS[basemap]);
      toggleLabels(map, basemap, labels);
      toggleRoads(map, roads);
    }
  }, [map, mapLoaded, basemap, labels, roads]);

  // We zoom to the SOC layers's bounding box if it has any
  useEffect(() => {
    const socLayer = activeDataLayers.find(layer => LAYERS[layer].group === 'soc');

    if (socLayer !== previousSOCLayer) {
      const bounds = LAYERS[socLayer].bbox;

      if (bounds && map) {
        const { width, height } = map.transform;
        updateViewport(getViewportFromBounds(width, height, viewport, bounds, { padding: 20 }));
      }

      setPreviousSOCLayer(socLayer);
    }
  }, [map, activeDataLayers, previousSOCLayer, setPreviousSOCLayer, viewport, updateViewport]);

  // When the map layers are updated, we close the map's popup
  useEffect(() => {
    setInteractiveFeaturesThrottled(null);
  }, [activeLayersDef, setInteractiveFeaturesThrottled]);

  if (!hasMounted) {
    return null;
  }

  return (
    <div
      className="c-explore"
      style={isDesktop ? { backgroundColor: BASEMAPS[basemap].backgroundColor } : undefined}
    >
      {isDesktop && (
        <>
          <Tour />
          <InfoModal
            layerId={infoLayer?.id}
            params={infoLayer}
            onClose={() => setInfoLayer(null)}
          />
          {drawing && <DrawBoard />}
          {!drawing && <Attributions />}
          {!drawing && <Tabs onClickInfo={setInfoLayer} />}
          {!drawing && <ExperimentalDatasetToggle />}
          {!drawing && (
            <Legend
              layers={legendDataLayers}
              onChangeOpacity={(id, opacity) => onChangeLayerSettings({ id, opacity })}
              onClickToggleVisibility={(id, visible) => onChangeLayerSettings({ id, visible })}
              onClickInfo={setInfoLayer}
              onClickRemove={removeLayer}
              onChangeDate={(id, dates) =>
                onChangeLayerSettings({
                  id,
                  dateRange: [dates[0], dates[2]],
                  currentDate: dates[1],
                })
              }
              onChangeLayersOrder={updateLayerOrder}
              onChangeParams={(id, params) => onChangeLayerSettings({ id, ...params })}
            />
          )}
          {/* Controls must be placed after the legend so they are visually on top (same z-index) */}
          <Controls
            zoom={zoom}
            acceptableMinZoom={acceptableMinZoom}
            acceptableMaxZoom={acceptableMaxZoom}
            basemap={basemap}
            basemapParams={basemapParams}
            roads={roads}
            labels={labels}
            onChangeZoom={updateZoom}
            onChangeBasemap={updateBasemap}
            onChangeBasemapParams={updateBasemapParams}
            onChangeRoads={updateRoads}
            onChangeLabels={updateLabels}
          />
          <MapContainer>
            <Map
              ref={mapRef}
              mapStyle={mapStyle}
              viewport={viewport}
              interactiveLayerIds={drawing ? [] : activeLayersInteractiveIds}
              featureStates={featureStates}
              getCursor={({ isHovering, isDragging }) => {
                if (drawing) return 'crosshair';
                if (isHovering) return 'pointer';
                if (isDragging) return 'grabbing';
                return 'grab';
              }}
              onViewportChange={onChangeViewport}
              onLoad={onLoadMap}
              onClick={onClickMap}
            >
              {map => (
                <>
                  {drawing && <DrawEditor />}
                  {interactiveFeatures && (
                    <InteractiveFeaturePopup
                      {...interactiveFeatures}
                      onClose={() => setInteractiveFeaturesThrottled(null)}
                    />
                  )}
                  <LayerManager map={map} providers={{}} layers={activeLayersDef} />
                </>
              )}
            </Map>
          </MapContainer>
        </>
      )}
      {!isDesktop && (
        <FullscreenMessage>
          This page contains interactive elements (including a map) which are best viewed on a
          larger screen. Please consider accessing it from a computer.
        </FullscreenMessage>
      )}
    </div>
  );
};

Explore.propTypes = {
  zoom: PropTypes.number.isRequired,
  acceptableMinZoom: PropTypes.number.isRequired,
  acceptableMaxZoom: PropTypes.number.isRequired,
  viewport: PropTypes.object.isRequired,
  basemap: PropTypes.string.isRequired,
  basemapParams: PropTypes.object,
  roads: PropTypes.bool.isRequired,
  labels: PropTypes.bool.isRequired,
  featureStates: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeDataLayers: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeLayersDef: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeLayersInteractiveIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  legendDataLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  drawing: PropTypes.bool.isRequired,
  serializedState: PropTypes.string.isRequired,
  restoreState: PropTypes.func.isRequired,
  updateZoom: PropTypes.func.isRequired,
  updateViewport: PropTypes.func.isRequired,
  updateBasemap: PropTypes.func.isRequired,
  updateBasemapParams: PropTypes.func.isRequired,
  updateRoads: PropTypes.func.isRequired,
  updateLabels: PropTypes.func.isRequired,
  removeLayer: PropTypes.func.isRequired,
  updateLayer: PropTypes.func.isRequired,
  updateLayerOrder: PropTypes.func.isRequired,
  updateBoundaries: PropTypes.func.isRequired,
};

Explore.defaultProps = {
  basemapProps: null,
};

export default Explore;
