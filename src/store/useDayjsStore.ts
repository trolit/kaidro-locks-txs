import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { defineStore } from "pinia";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const useDayjsStore = defineStore("useDayjsStore", () => {
  return {
    blockTimeToDate(value: number, format = "DD MMM YYYY") {
      return dayjs(value * 1000).format(format);
    },

    parseToTimezoneAndFormat(
      value: string,
      format = "DD MMM YYYY HH:mm",
      timezone = "GMT",
    ) {
      return dayjs(value).tz(timezone).format(format);
    },

    getTimestampInSeconds(value: string) {
      return dayjs(value).unix();
    },
  };
});
