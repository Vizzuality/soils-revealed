import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { BOUNDARIES, Popup } from 'components/map';
import { Select } from 'components/forms';

import './style.scss';

const ExploreInteractiveFeaturePopup = ({
  lat,
  lng,
  properties,
  boundaries,
  areaInterest,
  compareAreaInterest,
  onClose,
  updateAreaInterest,
  updateCompareAreaInterest,
}) => {
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);

  const onSubmit = useCallback(
    (updater, e) => {
      if (e) {
        e.preventDefault();
      }

      const selectedProperty = properties.find(prop => {
        if (typeof prop.id === 'number') {
          return prop.id === +selectedFeatureId;
        }
        return prop.id === selectedFeatureId;
      });

      updater({
        id: selectedFeatureId,
        name: BOUNDARIES[boundaries.id].config.interactiveFeatureName(selectedProperty),
        // FIXME: the landforms and biomes layers don't have a level property for the features
        // The current layers only display the level 1
        level: selectedProperty.level ?? 1,
        parentId: selectedProperty.level ?? 1 === 1 ? selectedProperty.parent_id : undefined,
        parentName:
          selectedProperty.level ?? 1 === 1
            ? BOUNDARIES[boundaries.id].config.interactiveFeatureParentName(selectedProperty)
            : undefined,
      });
      onClose();
    },
    [properties, boundaries, selectedFeatureId, onClose]
  );

  const onClickGo = useCallback(() => {
    const updater = compareAreaInterest ? updateCompareAreaInterest : updateAreaInterest;

    updater({
      id: properties[0].id,
      name: BOUNDARIES[boundaries.id].config.interactiveFeatureName(properties[0]),
      // FIXME: the landforms and biomes layers don't have a level property for the features
      // The current layers only display the level 1
      level: properties[0].level ?? 1,
      parentId: properties[0].level ?? 1 === 1 ? properties[0].parent_id : undefined,
      parentName:
        properties[0].level ?? 1 === 1
          ? BOUNDARIES[boundaries.id].config.interactiveFeatureParentName(properties[0])
          : undefined,
    });
    onClose();
  }, [
    boundaries,
    properties,
    compareAreaInterest,
    updateAreaInterest,
    updateCompareAreaInterest,
    onClose,
  ]);

  const onClickCompare = useCallback(() => {
    updateCompareAreaInterest({
      id: properties[0].id,
      name: BOUNDARIES[boundaries.id].config.interactiveFeatureName(properties[0]),
      // FIXME: the landforms and biomes layers don't have a level property for the features
      // The current layers only display the level 1
      level: properties[0].level ?? 1,
    });
    onClose();
  }, [boundaries, properties, updateCompareAreaInterest, onClose]);

  // TODO: this is temporal until the River basins and Political boundaries layers have a unique ID
  // for each of their features
  const supportedLayer = !!properties[0].id;

  return (
    <Popup
      latitude={lat}
      longitude={lng}
      dynamicPosition={false}
      closeButton={false}
      closeOnClick={false}
      onClose={onClose}
    >
      <div className="c-explore-interactive-feature-popup">
        {!supportedLayer && (
          <div>
            <div className="label">{BOUNDARIES[boundaries.id].label}</div>
            <p className="mt-2 mb-0 font-weight-bold">Coming soon!</p>
            <p>The analysis of this layer is not currently available.</p>
          </div>
        )}
        {supportedLayer && properties.length > 1 && (
          <form
            onSubmit={e =>
              onSubmit(compareAreaInterest ? updateCompareAreaInterest : updateAreaInterest, e)
            }
          >
            <div className="form-group">
              <label htmlFor="map-interactive-feature">
                Select {BOUNDARIES[boundaries.id].noun}:
              </label>
              <Select
                id="map-interactive-feature"
                options={[
                  { label: 'Select a geometry', value: '', disabled: true },
                  ...properties.map(prop => ({
                    label: BOUNDARIES[boundaries.id].config.interactiveFeatureName(prop),
                    value: `${prop.id}`,
                  })),
                ]}
                value={selectedFeatureId ?? ''}
                onChange={({ value }) => setSelectedFeatureId(value)}
              />
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className="btn btn-sm btn-primary btn-block"
                disabled={!selectedFeatureId}
              >
                Go
              </button>
              {!!areaInterest && !compareAreaInterest && (
                <button
                  type="button"
                  className="btn btn-sm btn-primary ml-2"
                  onClick={() => onSubmit(updateCompareAreaInterest)}
                  disabled={!selectedFeatureId}
                >
                  Compare
                </button>
              )}
            </div>
          </form>
        )}
        {supportedLayer && properties.length === 1 && (
          <div>
            <div className="label">{BOUNDARIES[boundaries.id].label}</div>
            <p className="mt-2 mb-0 font-weight-bold">
              {BOUNDARIES[boundaries.id].config.interactiveFeatureName(properties[0])}
            </p>
            {!!BOUNDARIES[boundaries.id].config.interactiveFeatureDescription && (
              <p className="mb-3">
                {BOUNDARIES[boundaries.id].config.interactiveFeatureDescription(properties[0])}
              </p>
            )}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-sm btn-primary btn-block"
                onClick={onClickGo}
              >
                Go
              </button>
              {!!areaInterest && !compareAreaInterest && (
                <button
                  type="button"
                  className="btn btn-sm btn-primary ml-2"
                  onClick={onClickCompare}
                >
                  Compare
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
};

ExploreInteractiveFeaturePopup.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  properties: PropTypes.arrayOf(PropTypes.object).isRequired,
  boundaries: PropTypes.object.isRequired,
  areaInterest: PropTypes.object,
  compareAreaInterest: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  updateAreaInterest: PropTypes.func.isRequired,
  updateCompareAreaInterest: PropTypes.func.isRequired,
};

ExploreInteractiveFeaturePopup.defaultProps = {
  areaInterest: null,
  compareAreaInterest: null,
};

export default ExploreInteractiveFeaturePopup;
