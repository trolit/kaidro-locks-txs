import dayjs from "dayjs";
import { defineStore } from "pinia";

export const useDayjsStore = defineStore("useDayjsStore", () => {
  return {
    blockTimeToDate(value: number, format = "DD MMM YYYY") {
      return dayjs(value * 1000).format(format);
    },
  };
});
