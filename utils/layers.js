import moment from 'moment';

export const computeDecodeParams = (layer, { dateRange, currentDate }) => {
  const minDate = moment(layer.legend.timeline.minDate);
  const maxDate = moment(layer.legend.timeline.maxDate);

  const start = moment(dateRange[0]).isBefore(minDate) ? minDate : moment(dateRange[0]);
  const end = moment(dateRange[1]).isAfter(maxDate) ? maxDate : moment(dateRange[1]);
  const current = moment(currentDate).isAfter(maxDate) ? maxDate : moment(currentDate);

  const startDate = start;
  const endDate = current.isBefore(end) ? current : end;

  return {
    startYear: startDate.year(),
    startMonth: startDate.month(),
    startDay: startDate.dayOfYear(),
    endYear: endDate.year(),
    endMonth: endDate.month(),
    endDay: endDate.dayOfYear(),
  };
};
