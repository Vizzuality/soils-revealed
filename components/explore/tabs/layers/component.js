import React, { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { toggleBasemap, getLayerDef, getBoundariesDef } from 'utils/map';
import Icon from 'components/icon';
import {
  Map,
  LayerManager,
  BASEMAPS,
  BOUNDARIES,
  mapStyle,
  getViewportFromBounds,
} from 'components/map';
import { Accordion, AccordionItem } from 'components/accordion';
import StandardGroup from './standard-group';
import SOCGroup from './soc-group';
import AreasInterestGroup from './areas-interest-group';
import Description from './description';

import './style.scss';

const ExploreLayersTab = ({
  basemap,
  bounds,
  boundaries,
  basemapLayerDef,
  layersByGroup,
  layers,
  activeLayers,
  onClickInfo,
  onClose,
  updateBoundaries,
  updateActiveLayers,
}) => {
  const mapRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const map = useMemo(() => mapRef.current?.getMap(), [mapRef.current]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [viewport, setViewport] = useState(undefined);
  const [previewedLayerId, setPreviewedLayerId] = useState(null);
  const [previewedBoundaries, setPreviewedBoundaries] = useState(null);
  const [activeLayersIds, setActiveLayersIds] = useState(activeLayers);
  const [boundariesId, setBoundariesId] = useState(boundaries.id);

  const previewedLayerDef = useMemo(() => {
    if (!previewedLayerId) {
      return null;
    }

    return getLayerDef(previewedLayerId, layers[previewedLayerId], {
      visible: true,
      opacity: 1,
      order: 0,
    });
  }, [layers, previewedLayerId]);

  const previewedBoundariesDef = useMemo(() => {
    if (!previewedBoundaries || !BOUNDARIES[previewedBoundaries].config) {
      return null;
    }

    return getBoundariesDef(previewedBoundaries, BOUNDARIES[previewedBoundaries], {});
  }, [previewedBoundaries]);

  const onLoadMap = useCallback(
    map => {
      setMapLoaded(true);
      toggleBasemap(map, BASEMAPS[basemap]);
    },
    [basemap, setMapLoaded]
  );

  const onChangeViewport = useCallback(debounce(setViewport, 500), [setViewport]);

  const onClickSave = useCallback(() => {
    updateActiveLayers(activeLayersIds);
    updateBoundaries({ id: boundariesId ?? 'no-boundaries' });
    onClose();
  }, [activeLayersIds, boundariesId, updateActiveLayers, updateBoundaries, onClose]);

  // When a layer is previewed we make sure the zoom is within the zoom range of the layer or else
  // we update it
  useEffect(() => {
    if (previewedLayerDef) {
      if (previewedLayerDef.source.minzoom && viewport.zoom < previewedLayerDef.source.minzoom) {
        setViewport(viewport => ({
          ...viewport,
          transitionDuration: 250,
          zoom: previewedLayerDef.source.minzoom,
        }));
      } else if (
        previewedLayerDef.source.maxzoom &&
        viewport.zoom > previewedLayerDef.source.maxzoom
      ) {
        setViewport(viewport => ({
          ...viewport,
          transitionDuration: 250,
          zoom: previewedLayerDef.source.maxzoom,
        }));
      }
    }
  }, [viewport, previewedLayerDef]);

  // When boundaries are previewed we make sure the zoom is within the zoom range of the layer or
  // else we update it
  useEffect(() => {
    if (previewedBoundaries) {
      if (
        BOUNDARIES[previewedBoundaries].config?.source.minzoom &&
        viewport.zoom < BOUNDARIES[previewedBoundaries].config?.source.minzoom
      ) {
        setViewport(viewport => ({
          ...viewport,
          transitionDuration: 250,
          zoom: BOUNDARIES[previewedBoundaries].config.source.minzoom,
        }));
      } else if (
        BOUNDARIES[previewedBoundaries].config?.source.maxzoom &&
        viewport.zoom > BOUNDARIES[previewedBoundaries].config?.source.maxzoom
      ) {
        setViewport(viewport => ({
          ...viewport,
          transitionDuration: 250,
          zoom: BOUNDARIES[previewedBoundaries].config.source.maxzoom,
        }));
      }
    }
  }, [viewport, previewedBoundaries]);

  // Whenever the list of active layers is updated in the store, the internal state of the
  // component should also follow
  useEffect(() => {
    setActiveLayersIds(activeLayers);
  }, [activeLayers]);

  // Whenever the boundaries are updated in the store, the internal state of the component should
  // also follow
  useEffect(() => {
    setBoundariesId(boundaries.id);
  }, [boundaries]);

  // Whenever the user changes the basemap, we make sure to use the same here
  useEffect(() => {
    if (mapLoaded) {
      toggleBasemap(map, BASEMAPS[basemap]);
    }
  }, [map, mapLoaded, basemap]);

  // Whenever the main map is moved, update the preview map as well
  useEffect(() => {
    if (bounds && mapLoaded) {
      const { width, height } = map.transform;

      setViewport(v => ({
        ...getViewportFromBounds(width, height, v, bounds),
        transitionDuration: 0,
      }));
    }
  }, [bounds, setViewport, mapLoaded, map]);

  return (
    <div className="c-explore-layers-tab">
      <button type="button" className="btn btn-outline-primary close-button" onClick={onClose}>
        <Icon name="close" />
      </button>
      <div className="sidebar">
        <h3>Add layers to the map</h3>
        <Accordion expanded={['soc', 'land-use']} className="mt-3">
          {Object.keys(layersByGroup).map(group => (
            <AccordionItem key={group} id={group}>
              {group !== 'soc' && group !== 'areas-interest' && (
                <StandardGroup
                  group={layersByGroup[group]}
                  activeLayersIds={activeLayersIds}
                  previewedLayerId={previewedLayerId}
                  onChangeActiveLayer={layerId =>
                    setActiveLayersIds(ids =>
                      activeLayersIds.indexOf(layerId) !== -1
                        ? ids.filter(id => id !== layerId)
                        : [...ids, layerId]
                    )
                  }
                  onClickPreview={layerId => {
                    setPreviewedLayerId(previewedLayerId === layerId ? null : layerId);
                    setPreviewedBoundaries(null);
                  }}
                />
              )}
              {group === 'soc' && (
                <SOCGroup
                  group={layersByGroup[group]}
                  activeLayersIds={activeLayersIds}
                  previewedLayerId={previewedLayerId}
                  onChangeActiveLayer={layerId =>
                    setActiveLayersIds(ids => [
                      ...ids.filter(id => !layersByGroup[group].layers.find(l => l.id === id)),
                      layerId,
                    ])
                  }
                  onClickPreview={layerId => {
                    setPreviewedLayerId(previewedLayerId === layerId ? null : layerId);
                    setPreviewedBoundaries(null);
                  }}
                />
              )}
              {group === 'areas-interest' && (
                <AreasInterestGroup
                  group={layersByGroup[group]}
                  activeLayersIds={[boundariesId]}
                  previewedLayerId={previewedBoundaries}
                  onChangeActiveLayer={layerId => setBoundariesId(layerId)}
                  onClickPreview={layerId => {
                    setPreviewedLayerId(null);
                    setPreviewedBoundaries(previewedBoundaries === layerId ? null : layerId);
                  }}
                />
              )}
            </AccordionItem>
          ))}
        </Accordion>
        <div className="text-center mt-4">
          <button type="button" className="btn btn-primary py-2 mr-2" onClick={onClickSave}>
            Save
          </button>
          <button type="button" className="btn btn-outline-primary py-2" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
      <div className="preview" style={{ backgroundColor: BASEMAPS[basemap].backgroundColor }}>
        <h3>Preview layers</h3>
        <Map
          ref={mapRef}
          mapStyle={mapStyle}
          viewport={viewport}
          onLoad={onLoadMap}
          onViewportChange={onChangeViewport}
        >
          {map => (
            <LayerManager
              map={map}
              providers={{}}
              layers={[
                ...(basemapLayerDef ? [basemapLayerDef] : []),
                ...(previewedBoundaries ? [previewedBoundariesDef] : []),
                ...(previewedLayerDef ? [previewedLayerDef] : []),
              ]}
            />
          )}
        </Map>
        <Description layerId={previewedLayerId} onClickInfo={onClickInfo} />
      </div>
    </div>
  );
};

ExploreLayersTab.propTypes = {
  basemap: PropTypes.string.isRequired,
  bounds: PropTypes.arrayOf(PropTypes.array),
  boundaries: PropTypes.object.isRequired,
  basemapLayerDef: PropTypes.object,
  layersByGroup: PropTypes.object.isRequired,
  layers: PropTypes.object.isRequired,
  activeLayers: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClickInfo: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  updateBoundaries: PropTypes.func.isRequired,
  updateActiveLayers: PropTypes.func.isRequired,
};

ExploreLayersTab.defaultProps = {
  bounds: null,
  basemapLayerDef: null,
};

export default ExploreLayersTab;
