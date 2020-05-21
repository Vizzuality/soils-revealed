import React, { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import debounce from 'lodash/debounce';

import { Router } from 'lib/routes';
import { useDesktop } from 'utils/hooks';
import { toggleBasemap, toggleLabels, toggleRoads, toggleBoundaries } from 'utils/map';
import {
  Map,
  LayerManager,
  Controls,
  Legend,
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
  boundaries,
  activeDataLayers,
  activeLayersDef,
  legendDataLayers,
  serializedState,
  restoreState,
  updateZoom,
  updateViewport,
  updateBasemap,
  updateBasemapParams,
  updateRoads,
  updateLabels,
  updateBoundaries,
  removeLayer,
  updateLayer,
  updateLayerOrder,
}) => {
  const isDesktop = useDesktop();
  const mapRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const map = useMemo(() => mapRef.current?.getMap(), [mapRef.current]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [infoLayerId, setInfoLayerId] = useState(null);
  const [previousSOCLayer, setPreviousSOCLayer] = useState(
    activeDataLayers.find(layer => LAYERS[layer].group === 'soc')
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
      toggleBoundaries(m, BOUNDARIES[boundaries]);
    },
    [basemap, labels, roads, boundaries]
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

  // When the basemap, labels, roads or boundaries change, we update the map style
  useEffect(() => {
    if (map && mapLoaded) {
      toggleBasemap(map, BASEMAPS[basemap]);
      toggleLabels(map, basemap, labels);
      toggleRoads(map, roads);
      toggleBoundaries(map, BOUNDARIES[boundaries]);
    }
  }, [map, mapLoaded, basemap, labels, roads, boundaries]);

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

  return (
    <div
      className="c-explore"
      style={isDesktop ? { backgroundColor: BASEMAPS[basemap].backgroundColor } : undefined}
    >
      {isDesktop && (
        <>
          <Tour />
          <InfoModal layerId={infoLayerId} onClose={() => setInfoLayerId(null)} />
          <Attributions />
          <Tabs onClickInfo={setInfoLayerId} />
          <ExperimentalDatasetToggle />
          <Legend
            layers={legendDataLayers}
            onChangeOpacity={(id, opacity) => updateLayer({ id, opacity })}
            onClickToggleVisibility={(id, visible) => updateLayer({ id, visible })}
            onClickInfo={setInfoLayerId}
            onClickRemove={removeLayer}
            onChangeDate={(id, dates) =>
              updateLayer({ id, dateRange: [dates[0], dates[2]], currentDate: dates[1] })
            }
            onChangeLayersOrder={updateLayerOrder}
            onChangeParams={(id, params) => updateLayer({ id, ...params })}
          />
          {/* Controls must be placed after the legend so they are visually on top (same z-index) */}
          <Controls
            zoom={zoom}
            acceptableMinZoom={acceptableMinZoom}
            acceptableMaxZoom={acceptableMaxZoom}
            basemap={basemap}
            basemapParams={basemapParams}
            roads={roads}
            labels={labels}
            boundaries={boundaries}
            onChangeZoom={updateZoom}
            onChangeBasemap={updateBasemap}
            onChangeBasemapParams={updateBasemapParams}
            onChangeRoads={updateRoads}
            onChangeLabels={updateLabels}
            onChangeBoundaries={updateBoundaries}
          />
          <Map
            ref={mapRef}
            mapStyle={mapStyle}
            viewport={viewport}
            onViewportChange={onChangeViewport}
            onLoad={onLoadMap}
          >
            {map => <LayerManager map={map} providers={{}} layers={activeLayersDef} />}
          </Map>
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
  boundaries: PropTypes.string.isRequired,
  activeDataLayers: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeLayersDef: PropTypes.arrayOf(PropTypes.object).isRequired,
  legendDataLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  serializedState: PropTypes.string.isRequired,
  restoreState: PropTypes.func.isRequired,
  updateZoom: PropTypes.func.isRequired,
  updateViewport: PropTypes.func.isRequired,
  updateBasemap: PropTypes.func.isRequired,
  updateBasemapParams: PropTypes.func.isRequired,
  updateRoads: PropTypes.func.isRequired,
  updateLabels: PropTypes.func.isRequired,
  updateBoundaries: PropTypes.func.isRequired,
  removeLayer: PropTypes.func.isRequired,
  updateLayer: PropTypes.func.isRequired,
  updateLayerOrder: PropTypes.func.isRequired,
};

Explore.defaultProps = {
  basemapProps: null,
};

export default Explore;
