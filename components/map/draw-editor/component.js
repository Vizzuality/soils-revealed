import React, { useCallback, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Editor, DrawPolygonMode } from 'react-map-gl-draw';
import getArea from '@turf/area';

const DrawEditor = ({
  areaInterest,
  drawingState,
  updateAreaInterest,
  updateCompareAreaInterest,
  updateDrawing,
  updateDrawingState,
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
        const area = getArea(geojson) / 1000000; // Area in sq km

        if (area < 1 || area > 1000000) {
          updateDrawingState('error');
        } else {
          // FIXME: remove the alert and implement the complete analysis of a custom shape
          alert(
            'This feature is currently under development. You will be taken out of the drawing mode.'
          );
          // const updater = areaInterest ? updateCompareAreaInterest : updateAreaInterest;
          // updater({ name: 'Custom area', geo: geojson });
          updateDrawing(false);
        }
      }
    },
    [
      areaInterest,
      drawingState,
      updateAreaInterest,
      updateCompareAreaInterest,
      updateDrawing,
      updateDrawingState,
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
  drawingState: PropTypes.string.isRequired,
  updateAreaInterest: PropTypes.func.isRequired,
  updateCompareAreaInterest: PropTypes.func.isRequired,
  updateDrawing: PropTypes.func.isRequired,
  updateDrawingState: PropTypes.func.isRequired,
};

DrawEditor.defaultProps = {
  areaInterest: null,
};

export default DrawEditor;
