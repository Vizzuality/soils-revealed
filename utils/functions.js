import { default as slugifyExt } from 'slugify';

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

/**
 * Return a slug based on a string
 * @param {string} string String to slugify
 */
export const slugify = string => slugifyExt(string).toLowerCase();

/**
 * Approximate or truncate the number so it is more readable
 * @param {number} number Number to format
 */
export const getHumanReadableValue = number => {
  if (number > 0 && number < 0.01) {
    return '< 0.01';
  }

  if (number < 0 && number > -0.01) {
    return '≈ 0';
  }

  return number.toFixed(2);
};

/**
 * Truncate a string to a number of characters, adding an ellipsis at the end
 * @param {string} str String to truncate
 * @param {number} charLimit Character limit
 */
export const truncate = (str, charLimit) => {
  if (str.length > charLimit) {
    return `${str.slice(0, charLimit - 1)}…`;
  }

  return str;
};
