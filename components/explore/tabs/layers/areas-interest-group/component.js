import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { logEvent } from 'utils/analytics';
import { AccordionTitle, AccordionPanel } from 'components/accordion';
import Icon from 'components/icon';
import { Radio } from 'components/forms';

const AreasInterestGroup = ({
  group,
  activeLayersIds,
  previewedLayerId,
  onChangeActiveLayer,
  onClickPreview: onChangePreview,
}) => {
  const onClickPreview = useCallback(
    layer => {
      logEvent('Map layers', 'Preview', layer.label);
      onChangePreview(layer.id);
    },
    [onChangePreview]
  );

  const onToggleLayer = useCallback(
    layer => {
      if (activeLayersIds.indexOf(layer.id) === -1) {
        logEvent('Map layers', 'Toggle', layer.label);
      }

      onChangeActiveLayer(layer.id);
    },
    [activeLayersIds, onChangeActiveLayer]
  );

  return (
    <>
      <AccordionTitle aria-level={4}>
        <span className="group-title">{group.label}</span>
      </AccordionTitle>
      <AccordionPanel>
        {group.layers.map(layer => (
          <div
            key={layer.id}
            className={[
              'row',
              'layer-row',
              ...(layer.id === previewedLayerId ? ['-highlighted'] : []),
            ].join(' ')}
          >
            <div className="col-8">
              <Radio
                id={layer.id}
                name="layers-tab-areas-interest-layer"
                checked={activeLayersIds.indexOf(layer.id) !== -1}
                onChange={() => onToggleLayer(layer)}
              >
                {layer.label}
              </Radio>
            </div>
            <div className="col-4">
              {layer.id !== 'no-boundaries' && (
                <button type="button" className="btn" onClick={() => onClickPreview(layer)}>
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
              )}
            </div>
          </div>
        ))}
      </AccordionPanel>
    </>
  );
};

AreasInterestGroup.propTypes = {
  group: PropTypes.object.isRequired,
  activeLayersIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  previewedLayerId: PropTypes.string,
  onChangeActiveLayer: PropTypes.func.isRequired,
  onClickPreview: PropTypes.func.isRequired,
};

AreasInterestGroup.defaultProps = {
  previewedLayerId: null,
};

export default AreasInterestGroup;
