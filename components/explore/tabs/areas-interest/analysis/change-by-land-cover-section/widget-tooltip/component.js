import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FloatingPortal, autoUpdate, offset, shift, useFloating } from '@floating-ui/react';

const ChangeByLandCoverSectionWidgetTooltip = ({
  open,
  payload,
  y,
  chartRef,
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

  const { refs, floatingStyles } = useFloating({
    open,
    placement: 'right-start',
    elements: {
      reference: chartRef.current.container,
    },
    whileElementsMounted: autoUpdate,
    middleware: [offset({ crossAxis: y }), shift()],
  });

  if (!open || !payload.length) {
    return null;
  }

  return (
    <FloatingPortal>
      <div
        className="recharts-default-tooltip -change-by-land-cover"
        ref={refs.setFloating}
        style={floatingStyles}
      >
        <div className="recharts-tooltip-item">
          Land cover{' '}
          {socLayerState.type === 'future'
            ? typeOptions[1].settings.year2.defaultOption
            : year1Option.label}
        </div>
        <ul>
          {payload.map(({ name, value, compareValue, color }) => (
            <li key={name}>
              <div className="color-pill" style={{ background: color }} />
              <div className="item">
                <div className="name">{name}</div>
                <div className="values">
                  <div>
                    {compareValue !== undefined ? 'Top: ' : ''}
                    <span className="recharts-tooltip-item">{value}</span>
                  </div>
                  {compareValue !== undefined && (
                    <div>
                      Bottom: <span className="recharts-tooltip-item">{compareValue}</span>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </FloatingPortal>
  );
};

ChangeByLandCoverSectionWidgetTooltip.propTypes = {
  open: PropTypes.bool.isRequired,
  payload: PropTypes.object.isRequired,
  y: PropTypes.number.isRequired,
  chartRef: PropTypes.object.isRequired,
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  socLayerState: PropTypes.object.isRequired,
};

export default ChangeByLandCoverSectionWidgetTooltip;
