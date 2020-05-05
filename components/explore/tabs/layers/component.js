import React, { useCallback, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { toggleBasemap, getLayerDef } from 'utils/map';
import Icon from 'components/icon';
import { Map, LayerManager, BASEMAPS, mapStyle } from 'components/map';
import { Accordion, AccordionItem, AccordionTitle, AccordionPanel } from 'components/accordion';
import { Switch } from 'components/forms';

import './style.scss';

const ExploreLayersTab = ({
  basemap,
  bounds,
  basemapLayerDef,
  layersByGroup,
  layers,
  onClose,
  addLayer,
  removeLayer,
}) => {
  const [viewport, setViewport] = useState(undefined);
  const [activeLayerId, setActiveLayerId] = useState(null);
  const activeLayerDef = useMemo(() => {
    if (!activeLayerId) {
      return null;
    }

    return getLayerDef(activeLayerId, layers[activeLayerId], {
      visible: true,
      opacity: 1,
      order: 0,
    });
  }, [layers, activeLayerId]);

  const onLoadMap = useCallback(({ map }) => toggleBasemap(map, BASEMAPS[basemap]), [basemap]);
  const onChangeViewport = useCallback(debounce(setViewport, 500), [setViewport]);

  useEffect(() => {
    if (activeLayerDef) {
      if (activeLayerDef.source.minzoom && viewport.zoom < activeLayerDef.source.minzoom) {
        setViewport(viewport => ({
          ...viewport,
          transitionDuration: 250,
          zoom: activeLayerDef.source.minzoom,
        }));
      } else if (activeLayerDef.source.maxzoom && viewport.zoom > activeLayerDef.source.maxzoom) {
        setViewport(viewport => ({
          ...viewport,
          transitionDuration: 250,
          zoom: activeLayerDef.source.maxzoom,
        }));
      }
    }
  }, [viewport, activeLayerDef]);

  return (
    <div className="c-explore-layers-tab">
      <button type="button" className="btn btn-outline-primary close-button" onClick={onClose}>
        <Icon name="close" />
      </button>
      <div className="sidebar">
        <h3>Add layers to the map</h3>
        <Accordion expanded={Object.keys(layersByGroup)} className="mt-3">
          {Object.keys(layersByGroup).map(group => (
            <AccordionItem key={group} id={group}>
              <AccordionTitle aria-level={4}>
                <span className="group-title">{layersByGroup[group].label}</span>
              </AccordionTitle>
              <AccordionPanel>
                {layersByGroup[group].layers.map(layer => (
                  <div
                    key={layer.id}
                    className={[
                      'row',
                      'layer-row',
                      ...(layer.id === activeLayerId ? ['-highlighted'] : []),
                    ].join(' ')}
                  >
                    <div className="col-8">
                      <Switch
                        id={layer.id}
                        checked={layer.active}
                        onChange={() => (layer.active ? removeLayer(layer.id) : addLayer(layer.id))}
                      >
                        {layer.label}
                      </Switch>
                    </div>
                    <div className="col-4">
                      <button
                        type="button"
                        className="btn"
                        onClick={() =>
                          setActiveLayerId(activeLayerId === layer.id ? null : layer.id)
                        }
                      >
                        {activeLayerId === layer.id && (
                          <>
                            <Icon name="slashed-eye" /> Hide
                          </>
                        )}
                        {activeLayerId !== layer.id && (
                          <>
                            <Icon name="eye" /> Preview
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="preview" style={{ backgroundColor: BASEMAPS[basemap].backgroundColor }}>
        <h3>Preview layers</h3>
        <Map
          mapStyle={mapStyle}
          bounds={bounds ? { bbox: bounds, duration: 0 } : undefined}
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
                ...(activeLayerDef ? [activeLayerDef] : []),
              ]}
            />
          )}
        </Map>
        {activeLayerId && layers[activeLayerId].description && (
          <div className="description">
            {layers[activeLayerId].description}
            <button type="button" className="btn btn-sm btn-link" disabled>
              <Icon name="info" /> More information
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

ExploreLayersTab.propTypes = {
  basemap: PropTypes.string.isRequired,
  bounds: PropTypes.arrayOf(PropTypes.array),
  basemapLayerDef: PropTypes.object,
  layersByGroup: PropTypes.object.isRequired,
  layers: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  addLayer: PropTypes.func.isRequired,
  removeLayer: PropTypes.func.isRequired,
};

ExploreLayersTab.defaultProps = {
  bounds: null,
  basemapLayerDef: null,
};

export default ExploreLayersTab;
