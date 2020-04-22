import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import { Router } from 'lib/routes';
import { useDesktop } from 'utils/hooks';
import { BASEMAPS, Map, LayerManager, Controls } from 'components/map';
import FullscreenMessage from './fullscreen-message';

import './style.scss';

const Explore = ({
  zoom,
  acceptableMinZoom,
  acceptableMaxZoom,
  viewport,
  basemap,
  roads,
  labels,
  boundaries,
  serializedState,
  restoreState,
  updateZoom,
  updateViewport,
  updateBasemap,
  updateRoads,
  updateLabels,
  updateBoundaries,
}) => {
  const isDesktop = useDesktop();

  const onChangeViewport = useCallback(
    // @ts-ignore
    debounce(
      v => updateViewport({ zoom: v.zoom, latitude: v.latitude, longitude: v.longitude }),
      500
    ),
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
    <div className="c-explore">
      {isDesktop && (
        <>
          <Map
            mapStyle={BASEMAPS[basemap].mapStyle}
            viewport={viewport}
            onViewportChange={onChangeViewport}
          >
            {map => (
              <>
                <Controls
                  zoom={zoom}
                  acceptableMinZoom={acceptableMinZoom}
                  acceptableMaxZoom={acceptableMaxZoom}
                  basemap={basemap}
                  roads={roads}
                  labels={labels}
                  boundaries={boundaries}
                  onChangeZoom={updateZoom}
                  onChangeBasemap={updateBasemap}
                  onChangeRoads={updateRoads}
                  onChangeLabels={updateLabels}
                  onChangeBoundaries={updateBoundaries}
                />
                <LayerManager map={map} providers={{}} layers={[]} />
              </>
            )}
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
  roads: PropTypes.bool.isRequired,
  labels: PropTypes.bool.isRequired,
  boundaries: PropTypes.string.isRequired,
  serializedState: PropTypes.string.isRequired,
  restoreState: PropTypes.func.isRequired,
  updateZoom: PropTypes.func.isRequired,
  updateViewport: PropTypes.func.isRequired,
  updateBasemap: PropTypes.func.isRequired,
  updateRoads: PropTypes.func.isRequired,
  updateLabels: PropTypes.func.isRequired,
  updateBoundaries: PropTypes.func.isRequired,
};

export default Explore;
