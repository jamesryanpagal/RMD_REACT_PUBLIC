import moment from "moment-timezone";

export const DATE_FORMAT = {
  timezone: "Asia/Manila",
  defaultformat: "YYYY-MM-DD",
  dateAbbrev: "ddd",
  monthAbrev: "MMM",
  monthIndex: "M",
  yearMonth: "YYYY-MM",
  shortDateAbbrev: "MMM D, YYYY",
  fullDateAbbrev: "MMMM D, YYYY",
  time24h: "HH:mm",
  time12h: "hh:mm A",
  datetimesec: "YYYY-MM-DD hh:mm A",
  monthDayYear: "MM/DD/YYYY",
  monthDayYearTime: "MM/DD/YYYY hh:mm A",
  dateTimeUtc8: "MMMM DD, YYYY h:mm:ss A [UTC+8]",
  isoZulu: "YYYY-MM-DDTHH:mm:ssZ",
  dateTimeStamp: "YYYYMMDD_HHmmss",
};

export const mtz = (
  inp: string | moment.MomentInput = moment(),
  format?: keyof typeof DATE_FORMAT, // ? this would be the format on the inp ( the first argument ) format must be the same otherwise will return invalid date
) => {
  if (!format) {
    // Use utc() to properly handle UTC timestamps
    return moment.utc(inp).tz(DATE_FORMAT.timezone);
  }
  return moment.utc(inp, DATE_FORMAT[format]).tz(DATE_FORMAT.timezone);
};
