import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { getHumanReadableValue } from 'utils/functions';
import { LAYERS } from 'components/map/constants';

const ChangeByLandCoverSectionWidgetTooltip = ({
  payload,
  detailedClasses,
  unitPow,
  unitPrefix,
  legendLayers,
  socLayerState,
}) => {
  const socLayerGroup = useMemo(
    () => legendLayers.find(layer => layer.id === 'soc-stock' || layer.id === 'soc-experimental'),
    [legendLayers]
  );

  const typeOptions = useMemo(
    () => socLayerGroup.layers[0].extraParams.config.settings.type.options,
    [socLayerGroup]
  );

  const typeOption = useMemo(
    () =>
      socLayerState.config.settings.type.options.find(
        option => option.value === socLayerState.type
      ),
    [socLayerState]
  );

  const year1Option = useMemo(
    () =>
      typeOption.settings.year.options.find(
        option => option.value === `${typeOption.settings.year1?.defaultOption}`
      ),
    [typeOption]
  );

  if (!payload.length) {
    return null;
  }

  const payloadData = !detailedClasses
    ? payload
    : Object.keys(payload[0].payload.breakdown).map(id => {
        const legendItem = LAYERS['land-cover'].legend.items.find(
          ({ id: itemId }) => itemId === id
        );

        if (!legendItem) {
          return null;
        }

        return {
          id,
          name: legendItem.name,
          color: legendItem.color,
          value: payload[0].payload.breakdown[id],
        };
      });

  return (
    <div className="recharts-default-tooltip">
      <div className="recharts-tooltip-item">
        Land cover{' '}
        {socLayerState.type === 'future'
          ? typeOptions[1].settings.year2.defaultOption
          : year1Option.label}
      </div>
      <ul>
        {payloadData
          .sort(({ value: valueA }, { value: valueB }) => {
            if (valueA * valueB < 0) {
              return valueA < 0 ? -1 : 1;
            }

            return valueB - valueA;
          })
          .map(item => {
            // The value we receive is in tons, so we need to multiply it by 10⁶
            let formattedValue = getHumanReadableValue(
              (item.value * Math.pow(10, 6)) / Math.pow(10, unitPow)
            );

            formattedValue = item.value === 0 ? 0 : `${formattedValue} ${unitPrefix}g C`;

            return (
              <li key={item.name}>
                <div className="color-pill" style={{ background: item.color }} />
                <div>
                  <div>{item.name}</div>
                  <div className="recharts-tooltip-item">{formattedValue}</div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

ChangeByLandCoverSectionWidgetTooltip.propTypes = {
  payload: PropTypes.object.isRequired,
  detailedClasses: PropTypes.bool,
  unitPow: PropTypes.number.isRequired,
  unitPrefix: PropTypes.string.isRequired,
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  socLayerState: PropTypes.object.isRequired,
};

ChangeByLandCoverSectionWidgetTooltip.defaultProps = {
  detailedClasses: false,
};

export default ChangeByLandCoverSectionWidgetTooltip;
