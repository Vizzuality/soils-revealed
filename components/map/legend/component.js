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

// By default, LegendListItem passes all of its props to its children
// As a result, when its disabled prop is set to true, the slider of the opacity button is also
// disabled, which is not what we want
// This component is then a small wrapper to omit the disabled prop
const OpacityButton = props => {
  // eslint-disable-next-line no-unused-vars, react/prop-types
  const { disabled, ...rest } = props;
  return <LegendItemButtonOpacity {...rest} />;
};

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
      onChangeOrder={layers => onChangeLayersOrder([...layers].reverse())}
    >
      {layers.map(layer => (
        <LegendListItem
          key={layer.id}
          layerGroup={layer}
          disabled={layer.readonly}
          title={<LegendTitle layerGroup={layer} onChangeParams={onChangeParams} />}
          toolbar={
            <LegendItemToolbar onChangeOpacity={(_, opacity) => onChangeOpacity(layer.id, opacity)}>
              {(!layer.readonly || !!layer.canChangeOpacity) && <OpacityButton />}
              {!layer.readonly && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => onClickToggleVisibility(layer.id, !layer.visibility)}
                  aria-label="Toggle visibility"
                >
                  <Icon name={layer.visibility ? 'eye' : 'slashed-eye'} />
                </button>
              )}
              {!layer.readonly && (
                <button
                  type="button"
                  className="btn"
                  onClick={() =>
                    onClickInfo({
                      id: layer.id,
                      tab: layer.id === 'soc-stock' ? layer.layers[0].extraParams.type : null,
                    })
                  }
                  aria-label="Info"
                >
                  <Icon name="info" />
                </button>
              )}
              {!layer.readonly && layer.closeable && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => onClickRemove(layer.id)}
                  aria-label="Remove"
                >
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
