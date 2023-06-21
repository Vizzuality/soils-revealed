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
 * Reduce the precision of a number
 * @param {number} value Value for which we want to reduce the precision
 * @param {number} sigDigitsCount Number of significant digits to use
 */
export const reducePrecision = (value, sigDigitsCount) => {
  const power = Math.floor(Math.log10(Math.abs(value)));
  const integerDigitsCount = power + 1;

  if (sigDigitsCount > integerDigitsCount) {
    return value.toFixed(sigDigitsCount - integerDigitsCount);
  }

  const factor = Math.pow(10, integerDigitsCount - sigDigitsCount);

  return (Math.round(value / factor) * factor).toFixed(0);
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
  if (number === undefined || number === null) {
    return '−';
  }

  if (number === 0) {
    return '0';
  }

  if (Math.abs(number) < 0.01) {
    return '≈ 0';
  }

  // Return the number with 2 or 3 significant digits depending on the first non-0 digit
  return reducePrecision(number, +`${number}`.replace(/0|\.|-/g, '')[0] >= 5 ? 2 : 3);
};

/**
 * Return the scientific prefix (k, M, G, etc.) and power of 10 of a value
 * @param {number} value Value to analyze in tons
 * @returns {[string, number]}
 */
export const getValuePrefixAndPow = value => {
  const factors = /** @type {[string, number][]} */ ([
    ['P', 15],
    ['T', 12],
    ['G', 9],
    ['M', 6],
    ['k', 3],
    ['', 0],
  ]);

  return factors.find(
    // The value we receive is in tons, so we need to multiply it by 10⁶
    ([, pow]) => Math.abs(value * Math.pow(10, 6)) / Math.pow(10, pow) > 1 || pow === 0
  );
};

/**
 * Return the formatted value and its unit
 * @param {number} value Value to be formatted
 * @param {string} layer ID of the SOC layer
 * @param {string} layerType ID of the type option of the layer
 * @param {'ranking-avg'|'ranking-total'|'analysis-timeseries'|'analysis-change-avg'|'analysis-change-total'} section Section in which the value is displayed
 * @returns {{ value: string, unit: string }}
 */
export const getFormattedValue = (value, layer, layerType, section) => {
  // The following list of formatters is based on this document:
  // https://docs.google.com/document/d/1q9mn8tM7KndOcuuTKMnxuez6Crv08DLx1NFkc2vQ4Xc/edit?usp=sharing
  const formatters = [
    // Category a
    {
      condition: ({ layer, layerType, section }) =>
        layer === 'soc-stock' &&
        layerType === 'historic' &&
        (section === 'ranking-avg' || section === 'analysis-change-avg'),
      formatter: value => ({
        unit: 't C/ha',
        value: getHumanReadableValue(value),
      }),
    },
    // Category b
    {
      condition: ({ layer, layerType, section }) =>
        ((layer === 'soc-stock' && (layerType === 'recent' || layerType === 'future')) ||
          (layer === 'soc-experimental' && layerType === 'stock')) &&
        (section === 'analysis-timeseries' || section === 'analysis-change-avg'),
      formatter: value => ({
        unit: 't C/ha',
        value: getHumanReadableValue(value),
      }),
    },
    // Category c
    {
      condition: ({ layer, layerType, section }) =>
        ((layer === 'soc-stock' && (layerType === 'recent' || layerType === 'future')) ||
          (layer === 'soc-experimental' && layerType === 'stock')) &&
        section === 'ranking-avg',
      formatter: value => {
        const changeUnit = Math.abs(value) < 0.01;
        return {
          unit: changeUnit ? 'kg C/(ha·year)' : 't C/(ha·year)',
          value: getHumanReadableValue(changeUnit ? value * 1000 : value),
        };
      },
    },
    // Category d
    {
      condition: ({ layer, layerType, section }) =>
        (layer === 'soc-stock' || (layer === 'soc-experimental' && layerType === 'stock')) &&
        (section === 'ranking-total' || section === 'analysis-change-total'),
      formatter: value => {
        const [prefix, pow] = getValuePrefixAndPow(value);

        return {
          unit: `${prefix}g C`,
          // The value we receive is in tons, so we need to multiply it by 10⁶
          value: getHumanReadableValue((value * Math.pow(10, 6)) / Math.pow(10, pow)),
        };
      },
    },
    // Category e
    {
      condition: ({ layer, layerType, section }) =>
        layer === 'soc-experimental' &&
        layerType === 'concentration' &&
        section === 'analysis-timeseries',
      formatter: value => ({
        unit: 'g C/kg',
        value: getHumanReadableValue(value),
      }),
    },
    // Category f
    {
      condition: ({ layer, layerType, section }) =>
        layer === 'soc-experimental' &&
        layerType === 'concentration' &&
        section === 'analysis-change-avg',
      formatter: value => ({
        unit: 'g C/kg',
        value: getHumanReadableValue(value),
      }),
    },
    // Extra category for the white cell
    {
      condition: ({ layer, layerType, section }) =>
        layer === 'soc-experimental' && layerType === 'concentration' && section === 'ranking-avg',
      formatter: value => ({
        unit: 'g C/(kg·year)',
        value: getHumanReadableValue(value),
      }),
    },
  ];

  const formatter = formatters.find(formatter =>
    formatter.condition({ layer, layerType, section })
  );

  return formatter?.formatter(value) ?? { unit: '−', value: getHumanReadableValue(value) };
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
