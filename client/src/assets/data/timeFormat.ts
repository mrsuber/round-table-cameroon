export enum formatEnum {
  TWELVE_HOURS = '12 Hours',
  TWENTYFOUR_HOURS = '24 Hours',
}

export const timeFormat = [
  {
    id: 0,
    format: formatEnum.TWENTYFOUR_HOURS,
  },
  {
    id: 1,
    format: formatEnum.TWELVE_HOURS,
  },
]
