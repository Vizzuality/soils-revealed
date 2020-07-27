import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Editor, DrawPolygonMode } from 'react-map-gl-draw';

const DrawEditor = ({
  areaInterest,
  updateAreaInterest,
  updateCompareAreaInterest,
  updateDrawing,
}) => {
  const onUpdate = useCallback(
    ({ editType, data }) => {
      if (editType === 'addFeature') {
        // FIXME: remove the alert and implement the complete analysis of a custom shape
        alert(
          'This feature is currently under development. You will be taken out of the drawing mode.'
        );
        // const updater = areaInterest ? updateCompareAreaInterest : updateAreaInterest;
        // updater({ name: 'Custom area', geo: data });
        updateDrawing(false);
      }
    },
    [areaInterest, updateAreaInterest, updateCompareAreaInterest, updateDrawing]
  );

  return (
    <Editor
      mode={new DrawPolygonMode()}
      clickRadius={7}
      editHandleShape="circle"
      featureStyle={{
        stroke: '#1a203c',
        strokeWidth: '2',
        fill: 'none',
      }}
      editHandleStyle={{
        stroke: '#1a203c',
        strokeWidth: 2,
        fill: '#f2f3ef',
        r: '6px',
      }}
      onUpdate={onUpdate}
    />
  );
};

DrawEditor.propTypes = {
  areaInterest: PropTypes.object,
  updateAreaInterest: PropTypes.func.isRequired,
  updateCompareAreaInterest: PropTypes.func.isRequired,
  updateDrawing: PropTypes.func.isRequired,
};

DrawEditor.defaultProps = {
  areaInterest: null,
};

export default DrawEditor;
