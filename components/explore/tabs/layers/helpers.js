export const getGroupLayers = (groupId, group) => {
  if (groupId === 'soc') {
    return [...group.layers].reverse();
  }
  return group.layers;
};
