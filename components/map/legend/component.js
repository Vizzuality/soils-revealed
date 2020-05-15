import React from 'react';
import PropTypes from 'prop-types';
import {
  Legend as VizzLegend,
  LegendListItem,
  LegendItemToolbar,
  LegendItemButtonOpacity,
  LegendItemTypes,
  LegendItemTimeStep,
} from 'vizzuality-components';

import Icon from 'components/icon';
import LegendTitle from './title';
import SOCExperimentalLegend from './soc-experimental';
import SOCStockLegend from './soc-stock';

import './style.scss';

const Legend = ({
  layers,
  onClickToggleVisibility,
  onChangeOpacity,
  onClickInfo,
  onClickRemove,
  onChangeDate,
  onChangeLayersOrder,
  onChangeParams,
}) => (
  <div className="c-map-legend">
    <VizzLegend
      sortable
      expanded
      maxHeight={420}
      onChangeOrder={layers => onChangeLayersOrder(layers.reverse())}
    >
      {layers.map(layer => (
        <LegendListItem
          key={layer.id}
          layerGroup={layer}
          disabled={layer.readonly}
          title={<LegendTitle layerGroup={layer} onChangeParams={onChangeParams} />}
          toolbar={
            <LegendItemToolbar onChangeOpacity={(_, opacity) => onChangeOpacity(layer.id, opacity)}>
              {!layer.readonly && <LegendItemButtonOpacity />}
              {!layer.readonly && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => onClickToggleVisibility(layer.id, !layer.visibility)}
                >
                  <Icon name={layer.visibility ? 'eye' : 'slashed-eye'} />
                </button>
              )}
              {!layer.readonly && (
                <button type="button" className="btn" onClick={() => onClickInfo(layer.id)}>
                  <Icon name="info" />
                </button>
              )}
              {!layer.readonly && layer.closeable && (
                <button type="button" className="btn" onClick={() => onClickRemove(layer.id)}>
                  <Icon name="close" />
                </button>
              )}
            </LegendItemToolbar>
          }
        >
          {layer.id !== 'soc-experimental' && layer.id !== 'soc-stock' && <LegendItemTypes />}
          {layer.id !== 'soc-experimental' && layer.id !== 'soc-stock' && (
            <LegendItemTimeStep handleChange={dates => onChangeDate(layer.id, dates)} />
          )}
          {layer.id === 'soc-experimental' && (
            <SOCExperimentalLegend layerGroup={layer} onChangeParams={onChangeParams} />
          )}
          {layer.id === 'soc-stock' && (
            <SOCStockLegend layerGroup={layer} onChangeParams={onChangeParams} />
          )}
        </LegendListItem>
      ))}
    </VizzLegend>
  </div>
);

Legend.propTypes = {
  layers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeOpacity: PropTypes.func.isRequired,
  onClickToggleVisibility: PropTypes.func.isRequired,
  onClickInfo: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeLayersOrder: PropTypes.func.isRequired,
  onChangeParams: PropTypes.func.isRequired,
};

export default Legend;
