import React, { useCallback, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Editor, DrawPolygonMode } from 'react-map-gl-draw';
import getArea from '@turf/area';
import getBbox from '@turf/bbox';

import { logEvent } from 'utils/analytics';

const DrawEditor = ({
  areaInterest,
  compareAreaInterest,
  drawingState,
  boundaries,
  updateAreaInterest,
  updateCompareAreaInterest,
  updateDrawing,
  updateDrawingState,
  updateBoundaries,
}) => {
  const previousDrawingState = useRef(drawingState);
  const [mode] = useState(new DrawPolygonMode());
  const [editorKey, setEditorKey] = useState(0);

  const onUpdate = useCallback(
    ({ editType, data }) => {
      if (drawingState === 'error') {
        updateDrawingState('drawing');
      }

      if (editType === 'addFeature') {
        const geojson = {
          type: 'FeatureCollection',
          features: data,
        };

        // @ts-ignore
        const area = getArea(geojson) / 1000000; // Area in km²

        if (area < 1 || area > 1000000) {
          updateDrawingState('error');
        } else {
          logEvent('Areas of interest', 'draw', 'drawing completed');

          let bbox = /** @type {any} */ (getBbox(geojson));
          bbox = [bbox.slice(0, 2), bbox.slice(2, 4)];

          const updater = areaInterest ? updateCompareAreaInterest : updateAreaInterest;
          const areaIndex = areaInterest || compareAreaInterest ? 2 : 1;
          updater({ name: `Custom area ${areaIndex}`, geo: geojson, bbox });

          if (boundaries.id === 'no-boundaries') {
            updateBoundaries({ id: 'political-boundaries' });
          }

          updateDrawing(false);
        }
      }
    },
    [
      areaInterest,
      compareAreaInterest,
      drawingState,
      boundaries,
      updateAreaInterest,
      updateCompareAreaInterest,
      updateDrawing,
      updateDrawingState,
      updateBoundaries,
    ]
  );

  // Using a key on the Editor component is the only way to clean the previous polygon, while
  // letting the user start a new one on the *first* next click
  // If the API is used instead, the next first click a line between what used to be the previous'
  // polygon start point and the one created by the click
  useEffect(() => {
    if (previousDrawingState.current === 'drawing' && drawingState === 'error') {
      setEditorKey(k => k + 1);
    }

    previousDrawingState.current = drawingState;
  }, [previousDrawingState, drawingState, setEditorKey]);

  return (
    <Editor
      key={editorKey}
      mode={mode}
      clickRadius={7}
      editHandleShape="circle"
      featureStyle={{
        stroke: '#1a203c',
        strokeWidth: '2',
        fill: 'none',
      }}
      editHandleStyle={({ index }) => ({
        stroke: '#1a203c',
        strokeWidth: 2,
        fill: '#f2f3ef',
        r: index === 0 ? '6px' : '0px',
      })}
      onUpdate={onUpdate}
    />
  );
};

DrawEditor.propTypes = {
  areaInterest: PropTypes.object,
  compareAreaInterest: PropTypes.object,
  drawingState: PropTypes.string.isRequired,
  boundaries: PropTypes.object.isRequired,
  updateAreaInterest: PropTypes.func.isRequired,
  updateCompareAreaInterest: PropTypes.func.isRequired,
  updateDrawing: PropTypes.func.isRequired,
  updateDrawingState: PropTypes.func.isRequired,
  updateBoundaries: PropTypes.func.isRequired,
};

DrawEditor.defaultProps = {
  areaInterest: null,
  compareAreaInterest: null,
};

export default DrawEditor;
