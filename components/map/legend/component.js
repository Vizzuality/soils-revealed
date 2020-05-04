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

import './style.scss';

const Legend = ({
  layers,
  onClickToggleVisibility,
  onChangeOpacity,
  onClickInfo,
  onClickRemove,
  onChangeDate,
  onChangeLayersOrder,
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
          toolbar={
            <LegendItemToolbar onChangeOpacity={(_, opacity) => onChangeOpacity(layer.id, opacity)}>
              <LegendItemButtonOpacity />
              <button
                type="button"
                className="btn"
                onClick={() => onClickToggleVisibility(layer.id, !layer.visibility)}
              >
                <Icon name={layer.visibility ? 'eye' : 'slashed-eye'} />
              </button>
              <button type="button" className="btn" onClick={() => onClickInfo(layer.id)} disabled>
                <Icon name="info" />
              </button>
              {layer.closeable && (
                <button type="button" className="btn" onClick={() => onClickRemove(layer.id)}>
                  <Icon name="close" />
                </button>
              )}
            </LegendItemToolbar>
          }
        >
          <LegendItemTypes />
          <LegendItemTimeStep handleChange={dates => onChangeDate(layer.id, dates)} />
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
};

export default Legend;
