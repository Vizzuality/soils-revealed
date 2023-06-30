import React, { useMemo } from 'react';
import min from 'lodash/min';
import max from 'lodash/max';
import { Text } from 'recharts';

import Icon from 'components/icon';
import { getHumanReadableValue, getValuePrefixAndPow } from 'utils/functions';
import { LAYERS } from 'components/map/constants';

const BUTTON_SIZE = 22;
const BUTTON_SPACE = 26;
const LABEL_MAX_CHAR = 25;

export const useChartData = ({
  error,
  loading,
  data,
  showDetailedClasses,
  classId,
  compareAreaInterest,
}) => {
  const res = useMemo(() => {
    if (!!error || loading || !data || data.length === 0) {
      const [unitPrefix, unitPow] = getValuePrefixAndPow(0);

      return {
        chartData: [],
        barData: [],
        ...(compareAreaInterest ? { compareBarData: [] } : {}),
        dataKey: '',
        unitPrefix,
        unitPow,
        getTooltipData: () => [],
        getYAxisTick: () => undefined,
      };
    }

    if (!showDetailedClasses) {
      const chartData = data;

      const values = chartData.map(item => Object.values(item.breakdown)).flat();
      const compareValues = compareAreaInterest
        ? chartData.map(item => Object.values(item.compareBreakdown ?? {})).flat()
        : [];

      const minValue = min([values, compareValues].flat());
      const maxValue = max([values, compareValues].flat());
      const maxAbsValue = max([Math.abs(minValue), maxValue]);
      const [unitPrefix, unitPow] = getValuePrefixAndPow(maxAbsValue);

      return {
        chartData,
        barData: LAYERS['land-cover'].legend.items.map(item => ({
          ...item,
          dataKey: `breakdown.${item.id}`,
        })),
        ...(compareAreaInterest
          ? {
              compareBarData: LAYERS['land-cover'].legend.items.map(item => ({
                ...item,
                dataKey: `compareBreakdown.${item.id}`,
              })),
            }
          : {}),
        unitPrefix,
        unitPow,
        getTooltipData: payload => {
          if (payload.length === 0) {
            return [];
          }

          let res = payload.sort(({ value: valueA }, { value: valueB }) => {
            if (valueA * valueB < 0) {
              return valueA < 0 ? -1 : 1;
            }

            return valueB - valueA;
          });

          if (compareAreaInterest) {
            res = res.reduce((localRes, item) => {
              const existingItemIndex = localRes.findIndex(({ name }) => name === item.name);
              if (existingItemIndex !== -1) {
                return [
                  ...localRes.slice(0, existingItemIndex),
                  {
                    ...localRes[existingItemIndex],
                    value: item.dataKey.startsWith('compare')
                      ? localRes[existingItemIndex].value
                      : item.value,
                    compareValue: item.dataKey.startsWith('compare')
                      ? item.value
                      : localRes[existingItemIndex].compareValue,
                  },
                  ...(localRes.length > existingItemIndex + 1
                    ? localRes.slice(existingItemIndex + 1, localRes.length)
                    : []),
                ];
              } else {
                return [
                  ...localRes,
                  {
                    name: item.name,
                    color: item.color,
                    value: item.dataKey.startsWith('compare') ? null : item.value,
                    compareValue: item.dataKey.startsWith('compare') ? item.value : null,
                  },
                ];
              }
            }, []);
          }

          res = res.map(({ name, value, compareValue, color }) => {
            const formatter = value => {
              if (value === undefined || value === null) {
                return '−';
              }

              if (value === 0) {
                return 0;
              }

              return `${getHumanReadableValue(
                (value * Math.pow(10, 6)) / Math.pow(10, unitPow)
              )} ${unitPrefix}g C`;
            };

            return {
              name,
              color,
              value: formatter(value),
              ...(compareAreaInterest ? { compareValue: formatter(compareValue) } : {}),
            };
          });

          return res;
        },
        getYAxisTick: () => undefined,
      };
    }

    if (classId === null) {
      const chartData = data;

      const values = chartData.map(item => Object.values(item.detailedBreakdown)).flat();
      const compareValues = compareAreaInterest
        ? chartData.map(item => Object.values(item.compareDetailedBreakdown ?? {})).flat()
        : [];

      const minValue = min([values, compareValues].flat());
      const maxValue = max([values, compareValues].flat());
      const maxAbsValue = max([Math.abs(minValue), maxValue]);
      const [unitPrefix, unitPow] = getValuePrefixAndPow(maxAbsValue);

      return {
        chartData,
        barData: LAYERS['land-cover'].legend.items
          .map(item => item.items)
          .flat()
          .map(item => ({
            ...item,
            dataKey: `detailedBreakdown.${item.id}`,
          })),
        ...(compareAreaInterest
          ? {
              compareBarData: LAYERS['land-cover'].legend.items
                .map(item => item.items)
                .flat()
                .map(item => ({
                  ...item,
                  dataKey: `compareDetailedBreakdown.${item.id}`,
                })),
            }
          : {}),
        unitPrefix,
        unitPow,
        getTooltipData: payload => {
          if (payload.length === 0) {
            return [];
          }

          return [
            ...new Set([
              ...Object.keys(payload[0].payload.breakdown),
              ...(compareAreaInterest
                ? Object.keys(payload[0].payload.compareBreakdown ?? {})
                : []),
            ]),
          ]
            .map(id => {
              const legendItem = LAYERS['land-cover'].legend.items.find(
                ({ id: itemId }) => itemId === id
              );

              if (!legendItem) {
                return null;
              }

              return {
                id,
                name: legendItem.name,
                color: legendItem.color,
                value: payload[0].payload.breakdown[id],
                ...(compareAreaInterest
                  ? {
                      compareValue: payload[0].payload.compareBreakdown?.[id] ?? null,
                    }
                  : {}),
              };
            })
            .sort(({ value: valueA }, { value: valueB }) => {
              if (valueA * valueB < 0) {
                return valueA < 0 ? -1 : 1;
              }

              return valueB - valueA;
            })
            .map(({ name, value, compareValue, color }) => {
              const formatter = value => {
                if (value === undefined || value === null) {
                  return '−';
                }

                if (value === 0) {
                  return 0;
                }

                return `${getHumanReadableValue(
                  (value * Math.pow(10, 6)) / Math.pow(10, unitPow)
                )} ${unitPrefix}g C`;
              };

              return {
                name,
                color,
                value: formatter(value),
                ...(compareAreaInterest ? { compareValue: formatter(compareValue) } : {}),
              };
            });
        },
        // eslint-disable-next-line react/display-name
        getYAxisTick: setClassId => ({ payload, x, y, width, ...props }) => (
          <g>
            <Text x={x - BUTTON_SPACE} y={y} width={width - BUTTON_SPACE} {...props}>
              {payload.value}
            </Text>
            <foreignObject
              x={x - BUTTON_SIZE}
              y={y - BUTTON_SIZE / 2}
              width={BUTTON_SIZE}
              height={BUTTON_SIZE}
            >
              <button
                type="button"
                className="btn btn-sm btn-outline-primary class-button"
                aria-label="See breakdown"
                onClick={() => {
                  const { id } = chartData[payload.index];
                  setClassId(id);
                }}
              >
                <Icon name="bottom-arrow" />
              </button>
            </foreignObject>
          </g>
        ),
      };
    }

    const classObj = data.find(({ id }) => id === classId);

    const chartData = classObj
      ? [
          // We inject the parent class' data to be shown at the top
          classObj,
          ...classObj.subClasses,
        ]
      : [];

    const values = chartData.map(item => Object.values(item.detailedBreakdown)).flat();
    const compareValues = compareAreaInterest
      ? chartData.map(item => Object.values(item.compareDetailedBreakdown ?? {})).flat()
      : [];

    const minValue = min([values, compareValues].flat());
    const maxValue = max([values, compareValues].flat());
    const maxAbsValue = max([Math.abs(minValue), maxValue]);
    const [unitPrefix, unitPow] = getValuePrefixAndPow(maxAbsValue);

    return {
      chartData,
      barData: LAYERS['land-cover'].legend.items
        .map(item => item.items)
        .flat()
        .map(item => ({
          ...item,
          dataKey: `detailedBreakdown.${item.id}`,
        })),
      ...(compareAreaInterest
        ? {
            compareBarData: LAYERS['land-cover'].legend.items
              .map(item => item.items)
              .flat()
              .map(item => ({
                ...item,
                dataKey: `compareDetailedBreakdown.${item.id}`,
              })),
          }
        : {}),
      unitPrefix,
      unitPow,
      getTooltipData: payload => {
        if (payload.length === 0) {
          return [];
        }

        return [
          ...new Set([
            ...Object.keys(payload[0].payload.detailedBreakdown),
            ...(compareAreaInterest
              ? Object.keys(payload[0].payload.compareDetailedBreakdown ?? {})
              : []),
          ]),
        ]
          .map(id => {
            const legendItem = LAYERS['land-cover'].legend.items
              .map(item => item.items)
              .flat()
              .find(({ id: itemId }) => itemId === id);

            if (!legendItem) {
              return null;
            }

            return {
              id,
              name: legendItem.name,
              color: legendItem.color,
              value: payload[0].payload.detailedBreakdown[id],
              ...(compareAreaInterest
                ? {
                    compareValue: payload[0].payload.compareDetailedBreakdown?.[id] ?? null,
                  }
                : {}),
            };
          })
          .sort(({ value: valueA }, { value: valueB }) => {
            if (valueA * valueB < 0) {
              return valueA < 0 ? -1 : 1;
            }

            return valueB - valueA;
          })
          .map(({ name, value, compareValue, color }) => {
            const formatter = value => {
              if (value === undefined || value === null) {
                return '−';
              }

              if (value === 0) {
                return 0;
              }

              return `${getHumanReadableValue(
                (value * Math.pow(10, 6)) / Math.pow(10, unitPow)
              )} ${unitPrefix}g C`;
            };

            return {
              name,
              color,
              value: formatter(value),
              ...(compareAreaInterest ? { compareValue: formatter(compareValue) } : {}),
            };
          });
      },
      // eslint-disable-next-line react/display-name
      getYAxisTick: setClassId => ({ payload, x, y, width, ...props }) => {
        let textLabel = payload.value;
        if (textLabel.length > LABEL_MAX_CHAR) {
          const words = textLabel.split(/\s/);

          textLabel = '';
          for (let index = 0, length = words.length; index < length; index++) {
            const word = words[index];

            if (textLabel.length + word.length > LABEL_MAX_CHAR) {
              textLabel = `${textLabel}…`;
              break;
            }

            textLabel = `${textLabel} ${word}`;
          }
        }

        const showButton = payload.index === 0;

        return (
          <g>
            <g>
              <title>{payload.value}</title>
              <Text
                x={showButton ? x - BUTTON_SPACE : x}
                y={y}
                width={showButton ? width - BUTTON_SPACE : width}
                {...props}
              >
                {textLabel}
              </Text>
            </g>
            {showButton && (
              <foreignObject
                x={x - BUTTON_SIZE}
                y={y - BUTTON_SIZE / 2}
                width={BUTTON_SIZE}
                height={BUTTON_SIZE}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary class-button -back"
                  aria-label="Go back"
                  onClick={() => setClassId(null)}
                >
                  <Icon name="bottom-arrow" />
                </button>
              </foreignObject>
            )}
          </g>
        );
      },
    };
  }, [error, loading, data, showDetailedClasses, classId, compareAreaInterest]);

  return res;
};