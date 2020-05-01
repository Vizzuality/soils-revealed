import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { toggleBasemap } from 'utils/map';
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
  onClose,
  addLayer,
  removeLayer,
}) => {
  const onLoadMap = useCallback(({ map }) => toggleBasemap(map, BASEMAPS[basemap]), [basemap]);

  return (
    <div className="c-explore-layers-tab">
      <button type="button" className="btn btn-outline-primary close-button" onClick={onClose}>
        <Icon name="close" />
      </button>
      <div className="sidebar">
        <h3>Add layers to the map</h3>
        <Accordion
          expanded={Object.keys(layersByGroup).filter(group =>
            layersByGroup[group].layers.some(layer => layer.active)
          )}
          className="mt-3"
        >
          {Object.keys(layersByGroup).map(group => (
            <AccordionItem key={group} id={group}>
              <AccordionTitle aria-level={4}>
                <span className="group-title">{layersByGroup[group].label}</span>
              </AccordionTitle>
              <AccordionPanel>
                {layersByGroup[group].layers.map(layer => (
                  <div key={layer.id} className="layer-row">
                    <Switch
                      id={layer.id}
                      checked={layer.active}
                      onChange={() => (layer.active ? removeLayer(layer.id) : addLayer(layer.id))}
                    >
                      {layer.label}
                    </Switch>
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
          onLoad={onLoadMap}
        >
          {map => (
            <LayerManager
              map={map}
              providers={{}}
              layers={basemapLayerDef ? [basemapLayerDef] : []}
            />
          )}
        </Map>
      </div>
    </div>
  );
};

ExploreLayersTab.propTypes = {
  basemap: PropTypes.string.isRequired,
  bounds: PropTypes.arrayOf(PropTypes.array),
  basemapLayerDef: PropTypes.object,
  layersByGroup: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  addLayer: PropTypes.func.isRequired,
  removeLayer: PropTypes.func.isRequired,
};

ExploreLayersTab.defaultProps = {
  bounds: null,
  basemapLayerDef: null,
};

export default ExploreLayersTab;
