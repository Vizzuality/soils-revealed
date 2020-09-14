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

      let bbox;
      if (selectedProperty.bbox) {
        try {
          bbox = JSON.parse(selectedProperty.bbox);
          bbox = [bbox.slice(0, 2), bbox.slice(2, 4)];
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }

      updater({
        id: +selectedFeatureId,
        name: BOUNDARIES[boundaries.id].config.interactiveFeatureName(selectedProperty),
        level: selectedProperty.level,
        parentId: selectedProperty.level === 1 ? +selectedProperty.id_0 : undefined,
        parentName:
          selectedProperty.level === 1
            ? BOUNDARIES[boundaries.id].config.interactiveFeatureParentName(selectedProperty)
            : undefined,
        bbox,
      });
      onClose();
    },
    [properties, boundaries, selectedFeatureId, onClose]
  );

  const onClickGo = useCallback(() => {
    const updater = compareAreaInterest ? updateCompareAreaInterest : updateAreaInterest;

    let bbox;
    if (properties[0].bbox) {
      try {
        bbox = JSON.parse(properties[0].bbox);
        bbox = [bbox.slice(0, 2), bbox.slice(2, 4)];
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }

    updater({
      id: +properties[0].id,
      name: BOUNDARIES[boundaries.id].config.interactiveFeatureName(properties[0]),
      level: properties[0].level,
      parentId: properties[0].level === 1 ? +properties[0].id_0 : undefined,
      parentName:
        properties[0].level === 1
          ? BOUNDARIES[boundaries.id].config.interactiveFeatureParentName(properties[0])
          : undefined,
      bbox,
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
    let bbox;
    if (properties[0].bbox) {
      try {
        bbox = JSON.parse(properties[0].bbox);
        bbox = [bbox.slice(0, 2), bbox.slice(2, 4)];
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }

    updateCompareAreaInterest({
      id: +properties[0].id,
      name: BOUNDARIES[boundaries.id].config.interactiveFeatureName(properties[0]),
      level: properties[0].level,
      bbox,
    });
    onClose();
  }, [boundaries, properties, updateCompareAreaInterest, onClose]);

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
        {properties.length > 1 && (
          <form
            onSubmit={e =>
              onSubmit(compareAreaInterest ? updateCompareAreaInterest : updateAreaInterest, e)
            }
          >
            <div className="form-group">
              <label htmlFor="map-interactive-feature">
                Select a {BOUNDARIES[boundaries.id].noun}:
              </label>
              <Select
                id="map-interactive-feature"
                options={[
                  { label: 'Select a geometry', value: '', disabled: true },
                  {
                    label: BOUNDARIES[boundaries.id].level0Noun.replace(/^\w/, c =>
                      c.toUpperCase()
                    ),
                    options: [
                      ...properties
                        .filter(property => property.level === 0)
                        .map(prop => ({
                          label: BOUNDARIES[boundaries.id].config.interactiveFeatureName(prop),
                          value: `${prop.id}`,
                        })),
                    ],
                  },
                  ...(boundaries.id !== 'landforms'
                    ? [
                        {
                          label: BOUNDARIES[boundaries.id].level1Noun.replace(/^\w/, c =>
                            c.toUpperCase()
                          ),
                          options: [
                            ...properties
                              .filter(property => property.level === 1)
                              .map(prop => ({
                                label: BOUNDARIES[boundaries.id].config.interactiveFeatureName(
                                  prop
                                ),
                                value: `${prop.id}`,
                              })),
                          ],
                        },
                      ]
                    : []),
                  ...(boundaries.id === 'landforms'
                    ? [
                        ...new Set(
                          properties
                            .filter(property => property.level === 1)
                            .map(property =>
                              BOUNDARIES[boundaries.id].config.interactiveFeatureParentName(
                                property
                              )
                            )
                        ),
                      ].map(label => ({
                        label,
                        options: properties
                          .filter(
                            property =>
                              property.level === 1 &&
                              BOUNDARIES[boundaries.id].config.interactiveFeatureParentName(
                                property
                              ) === label
                          )
                          .map(prop => ({
                            label: BOUNDARIES[boundaries.id].config.interactiveFeatureName(prop),
                            value: `${prop.id}`,
                          })),
                      }))
                    : []),
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
        {properties.length === 1 && (
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
