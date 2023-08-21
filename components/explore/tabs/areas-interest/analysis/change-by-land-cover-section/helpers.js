import React, { useMemo } from 'react';
import min from 'lodash/min';
import max from 'lodash/max';
import { Text } from 'recharts';

import Icon from 'components/icon';
import { getHumanReadableValue, getValuePrefixAndPow, isValueInsignificant } from 'utils/functions';
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
  isFuture,
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
      let chartData = data;
      if (isFuture) {
        const typeOption = LAYERS['soc-stock'].paramsConfig.settings.type.options.find(
          ({ value }) => value === 'future'
        );
        const scenarios = [...typeOption.settings.scenario.options]
          .reverse()
          .map(({ label }) => label);

        chartData = scenarios
          .map(scenario => chartData.filter(({ group }) => group === scenario))
          .filter(items => items.length > 0)
          .reduce(
            (res, items) => [
              ...res,
              {
                id: items[0].group,
                group: items[0].group,
                name: items[0].group,
                breakdown: {},
                subClasses: [],
              },
              ...items,
            ],
            []
          );
      } else {
        chartData.sort((itemA, itemB) => {
          const itemANegativeTotal = Object.values(itemA.breakdown).reduce(
            (res, item) => res + (item < 0 ? item : 0),
            0
          );

          const itemBNegativeTotal = Object.values(itemB.breakdown).reduce(
            (res, item) => res + (item < 0 ? item : 0),
            0
          );

          if (itemANegativeTotal === itemBNegativeTotal) {
            return 0;
          }

          if (itemANegativeTotal < itemBNegativeTotal) {
            return -1;
          }

          return 1;
        });
      }

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

          let res = payload.sort(({ value: valueA }, { value: valueB }) => valueB - valueA);

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

          let hiddenItems = false;

          res = res
            .filter(item => {
              if (
                isValueInsignificant(item.value, 6 - unitPow) &&
                (!compareAreaInterest || isValueInsignificant(item.compareValue, 6 - unitPow))
              ) {
                hiddenItems = true;
                return false;
              }

              return true;
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
                  value * Math.pow(10, 6 - unitPow)
                )} ${unitPrefix}g C`;
              };

              return {
                name,
                color,
                value: formatter(value),
                ...(compareAreaInterest ? { compareValue: formatter(compareValue) } : {}),
                hiddenItems,
              };
            });

          return res;
        },
        getYAxisTick: isFuture
          ? () => ({ payload, x, y, width, ...props }) => {
              const typeOption = LAYERS['soc-stock'].paramsConfig.settings.type.options.find(
                ({ value }) => value === 'future'
              );
              const scenarios = typeOption.settings.scenario.options.map(({ label }) => label);
              const isScenario = scenarios.indexOf(payload.value) !== -1;

              return (
                <Text
                  x={x}
                  y={y}
                  dy={isScenario ? 15 : undefined}
                  width={width}
                  {...props}
                  className={isScenario ? '-scenario' : undefined}
                >
                  {payload.value}
                </Text>
              );
            }
          : () => undefined,
      };
    }

    if (classId === null) {
      let chartData = data;
      if (isFuture) {
        const typeOption = LAYERS['soc-stock'].paramsConfig.settings.type.options.find(
          ({ value }) => value === 'future'
        );
        const scenarios = [...typeOption.settings.scenario.options]
          .reverse()
          .map(({ label }) => label);

        chartData = scenarios
          .map(scenario => chartData.filter(({ group }) => group === scenario))
          .filter(items => items.length > 0)
          .reduce(
            (res, items) => [
              ...res,
              {
                id: items[0].group,
                group: items[0].group,
                name: items[0].group,
                breakdown: {},
                detailedBreakdown: {},
              },
              ...items,
            ],
            []
          );
      } else {
        chartData.sort((itemA, itemB) => {
          const itemANegativeTotal = Object.values(itemA.detailedBreakdown).reduce(
            (res, item) => res + (item < 0 ? item : 0),
            0
          );

          const itemBNegativeTotal = Object.values(itemB.detailedBreakdown).reduce(
            (res, item) => res + (item < 0 ? item : 0),
            0
          );

          if (itemANegativeTotal === itemBNegativeTotal) {
            return 0;
          }

          if (itemANegativeTotal < itemBNegativeTotal) {
            return -1;
          }

          return 1;
        });
      }

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

          let hiddenItems = false;

          if (isFuture) {
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
              .filter(item => {
                if (
                  isValueInsignificant(item.value, 6 - unitPow) &&
                  (!compareAreaInterest || isValueInsignificant(item.compareValue, 6 - unitPow))
                ) {
                  hiddenItems = true;
                  return false;
                }

                return true;
              })
              .sort(({ value: valueA }, { value: valueB }) => valueB - valueA)
              .map(({ name, value, compareValue, color }) => {
                const formatter = value => {
                  if (value === undefined || value === null) {
                    return '−';
                  }

                  if (value === 0) {
                    return 0;
                  }

                  return `${getHumanReadableValue(
                    value * Math.pow(10, 6 - unitPow)
                  )} ${unitPrefix}g C`;
                };

                return {
                  name,
                  color,
                  value: formatter(value),
                  ...(compareAreaInterest ? { compareValue: formatter(compareValue) } : {}),
                  hiddenItems,
                };
              });
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
            .filter(item => {
              if (
                isValueInsignificant(item.value, 6 - unitPow) &&
                (!compareAreaInterest || isValueInsignificant(item.compareValue, 6 - unitPow))
              ) {
                hiddenItems = true;
                return false;
              }

              return true;
            })
            .sort(({ value: valueA }, { value: valueB }) => valueB - valueA)
            .map(({ name, value, compareValue, color }) => {
              const formatter = value => {
                if (value === undefined || value === null) {
                  return '−';
                }

                if (value === 0) {
                  return 0;
                }

                return `${getHumanReadableValue(
                  value * Math.pow(10, 6 - unitPow)
                )} ${unitPrefix}g C`;
              };

              return {
                name,
                color,
                value: formatter(value),
                ...(compareAreaInterest ? { compareValue: formatter(compareValue) } : {}),
                hiddenItems,
              };
            });
        },
        // eslint-disable-next-line react/display-name
        getYAxisTick: setClassId => ({ payload, x, y, width, ...props }) => {
          if (isFuture) {
            const typeOption = LAYERS['soc-stock'].paramsConfig.settings.type.options.find(
              ({ value }) => value === 'future'
            );
            const scenarios = typeOption.settings.scenario.options.map(({ label }) => label);
            const isScenario = scenarios.indexOf(payload.value) !== -1;

            return (
              <Text
                x={x}
                y={y}
                dy={isScenario ? 15 : undefined}
                width={width}
                {...props}
                className={isScenario ? '-scenario' : undefined}
              >
                {payload.value}
              </Text>
            );
          }

          const hasSeveralSubClasses =
            (LAYERS['land-cover'].legend.items.find(({ id }) => id === chartData[payload.index].id)
              ?.items.length ?? 0) > 1;

          return (
            <g>
              <Text
                x={hasSeveralSubClasses ? x - BUTTON_SPACE : x}
                y={y}
                width={hasSeveralSubClasses ? width - BUTTON_SPACE : width}
                {...props}
              >
                {payload.value}
              </Text>
              {/* If the class has less than 2 sub-classes, then we don't allow the user to see its
                  breakdown since it's never relevant */}
              {hasSeveralSubClasses && (
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
              )}
            </g>
          );
        },
      };
    }

    const classObj = data.find(({ id }) => id === classId);

    const chartData = classObj
      ? [
          // We inject the parent class' data to be shown at the top
          classObj,
          ...classObj.subClasses.sort((itemA, itemB) => {
            const itemANegativeTotal = Object.values(itemA.detailedBreakdown).reduce(
              (res, item) => res + (item < 0 ? item : 0),
              0
            );

            const itemBNegativeTotal = Object.values(itemB.detailedBreakdown).reduce(
              (res, item) => res + (item < 0 ? item : 0),
              0
            );

            if (itemANegativeTotal === itemBNegativeTotal) {
              return 0;
            }

            if (itemANegativeTotal < itemBNegativeTotal) {
              return -1;
            }

            return 1;
          }),
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

        let hiddenItems = false;

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
          .filter(item => {
            if (
              isValueInsignificant(item.value, 6 - unitPow) &&
              (!compareAreaInterest || isValueInsignificant(item.compareValue, 6 - unitPow))
            ) {
              hiddenItems = true;
              return false;
            }

            return true;
          })
          .sort(({ value: valueA }, { value: valueB }) => valueB - valueA)
          .map(({ name, value, compareValue, color }) => {
            const formatter = value => {
              if (value === undefined || value === null) {
                return '−';
              }

              if (value === 0) {
                return 0;
              }

              return `${getHumanReadableValue(value * Math.pow(10, 6 - unitPow))} ${unitPrefix}g C`;
            };

            return {
              name,
              color,
              value: formatter(value),
              ...(compareAreaInterest ? { compareValue: formatter(compareValue) } : {}),
              hiddenItems,
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
  }, [error, loading, data, showDetailedClasses, classId, compareAreaInterest, isFuture]);

  return res;
};
