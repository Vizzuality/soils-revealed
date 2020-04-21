/**
 * Serialize some state as a base64 string
 * @param {any} state State to serialize
 */
export const serialize = state => {
  try {
    return btoa(JSON.stringify(state));
  } catch (e) {
    return '';
  }
};

/**
 * Deserialize a string encoded as base64
 * @param {string} string String to deserialize
 * @param {any} defaultState Default state if the deserialization fail
 */
export const deserialize = (string, defaultState = {}) => {
  try {
    return JSON.parse(atob(string));
  } catch (e) {
    return defaultState;
  }
};
