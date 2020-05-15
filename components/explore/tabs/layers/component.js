import React, { useCallback, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { toggleBasemap, getLayerDef } from 'utils/map';
import Icon from 'components/icon';
import { Map, LayerManager, BASEMAPS, mapStyle } from 'components/map';
import { Accordion, AccordionItem, AccordionTitle, AccordionPanel } from 'components/accordion';
import { Switch, Radio } from 'components/forms';

import './style.scss';

const ExploreLayersTab = ({
  basemap,
  bounds,
  basemapLayerDef,
  layersByGroup,
  layers,
  activeLayers,
  onClickInfo,
  onClose,
  updateActiveLayers,
}) => {
  const [viewport, setViewport] = useState(undefined);
  const [previewedLayerId, setPreviewedLayerId] = useState(null);
  const [activeLayersIds, setActiveLayersIds] = useState(activeLayers);

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

  const onLoadMap = useCallback(({ map }) => toggleBasemap(map, BASEMAPS[basemap]), [basemap]);
  const onChangeViewport = useCallback(debounce(setViewport, 500), [setViewport]);
  const onClickSave = useCallback(() => {
    updateActiveLayers(activeLayersIds);
    onClose();
  }, [activeLayersIds, updateActiveLayers, onClose]);

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

  // Whenever the list of active layers is updated in the store, the internal state of the
  // component should also follow
  useEffect(() => {
    setActiveLayersIds(activeLayers);
  }, [activeLayers]);

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
                      ...(layer.id === previewedLayerId ? ['-highlighted'] : []),
                    ].join(' ')}
                  >
                    <div className="col-8">
                      {group === 'soc' && (
                        <Radio
                          id={layer.id}
                          name="layers-tab-soc-layer"
                          checked={activeLayersIds.indexOf(layer.id) !== -1}
                          onChange={() => {
                            setActiveLayersIds(ids => [
                              ...ids.filter(
                                id => !layersByGroup[group].layers.find(l => l.id === id)
                              ),
                              layer.id,
                            ]);
                          }}
                        >
                          {layer.label}
                        </Radio>
                      )}
                      {group !== 'soc' && (
                        <Switch
                          id={layer.id}
                          checked={activeLayersIds.indexOf(layer.id) !== -1}
                          onChange={() =>
                            activeLayersIds.indexOf(layer.id) !== -1
                              ? setActiveLayersIds(ids => ids.filter(id => id !== layer.id))
                              : setActiveLayersIds(ids => [...ids, layer.id])
                          }
                        >
                          {layer.label}
                        </Switch>
                      )}
                    </div>
                    <div className="col-4">
                      <button
                        type="button"
                        className="btn"
                        onClick={() =>
                          setPreviewedLayerId(previewedLayerId === layer.id ? null : layer.id)
                        }
                      >
                        {previewedLayerId === layer.id && (
                          <>
                            <Icon name="slashed-eye" /> Hide
                          </>
                        )}
                        {previewedLayerId !== layer.id && (
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
                ...(previewedLayerDef ? [previewedLayerDef] : []),
              ]}
            />
          )}
        </Map>
        {previewedLayerId && layers[previewedLayerId].description && (
          <div className="description">
            {layers[previewedLayerId].description}
            <button
              type="button"
              className="btn btn-sm btn-link"
              onClick={() => onClickInfo(previewedLayerId)}
            >
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
  activeLayers: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClickInfo: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  updateActiveLayers: PropTypes.func.isRequired,
};

ExploreLayersTab.defaultProps = {
  bounds: null,
  basemapLayerDef: null,
};

export default ExploreLayersTab;
