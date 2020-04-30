import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { Router } from 'lib/routes';
import { useDesktop } from 'utils/hooks';
import { Map, LayerManager, Controls, Legend, BASEMAPS } from 'components/map';
import FullscreenMessage from './fullscreen-message';
import Tabs from './tabs';
import ExperimentalDatasetToggle from './experimental-dataset-toggle';
import Attributions from './attributions';

import './style.scss';

const MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'custom-layers',
      type: 'background',
      layout: {},
      paint: {
        'background-opacity': 0,
      },
    },
  ],
};

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
}) => {
  const isDesktop = useDesktop();

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

  return (
    <div className="c-explore" style={{ backgroundColor: BASEMAPS[basemap].backgroundColor }}>
      {isDesktop && (
        <>
          <Attributions />
          <Tabs />
          <ExperimentalDatasetToggle />
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
          <Legend
            layers={legendDataLayers}
            onChangeOpacity={(id, opacity) => updateLayer({ id, opacity })}
            onClickToggleVisibility={(id, visible) => updateLayer({ id, visible })}
            onClickInfo={console.log}
            onClickRemove={removeLayer}
            onChangeDate={(id, dates) =>
              updateLayer({ id, dateRange: [dates[0], dates[2]], currentDate: dates[1] })
            }
          />
          <Map mapStyle={MAP_STYLE} viewport={viewport} onViewportChange={onChangeViewport}>
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
};

Explore.defaultProps = {
  basemapProps: null,
};

export default Explore;
