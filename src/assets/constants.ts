export const MAX_PAGES_TO_FETCH_LIMIT = 15; // extra protection in case of issue when fetching transactions

export const LAST_SYNERGY_BEFORE_TGE_TIMESTAMP_IN_SECONDS = 1734220799; // 14.12.24 23:59 GMT

export const DELAY_BETWEEN_EACH_REQUEST_IN_SECONDS = 2;

export const TRANSACTION_HASH_OF_KAIDRO_REVERTING_SOME_AKDR =
  "0x088ec163713befe808c985e644e203c1d69c618a11dd091d6df2b04524d9e947";

// 12 AM UTC = 1 AM GMT :eyes:
export const RAW_SYNERGY_WEEKS = [
  {
    from: "2024-08-01 00:00 GMT",
    to: "2024-08-10 01:00 GMT",
  },

  {
    from: "2024-08-10 01:01 GMT",
    to: "2024-08-17 01:00 GMT",
  },

  {
    from: "2024-08-17 01:01 GMT",
    to: "2024-08-24 01:00 GMT",
  },

  {
    from: "2024-08-24 01:01 GMT",
    to: "2024-08-31 01:00 GMT",
  },

  // ----

  {
    from: "2024-09-01 00:00 GMT",
    to: "2024-09-07 01:00 GMT",
  },

  {
    from: "2024-09-07 01:01 GMT",
    to: "2024-09-14 01:00 GMT",
  },

  {
    from: "2024-09-14 01:01 GMT",
    to: "2024-09-21 01:00 GMT",
  },

  {
    from: "2024-09-21 01:01 GMT",
    to: "2024-09-28 01:00 GMT",
  },

  // ----

  {
    from: "2024-10-01 00:00 GMT",
    to: "2024-10-12 01:00 GMT",
  },

  {
    from: "2024-10-12 01:01 GMT",
    to: "2024-10-19 01:00 GMT",
  },

  {
    from: "2024-10-19 01:01 GMT",
    to: "2024-10-26 01:00 GMT",
  },

  {
    from: "2024-10-26 01:01 GMT",
    to: "2024-10-31 01:00 GMT",
  },

  // ----

  {
    from: "2024-11-01 00:00 GMT",
    to: "2024-11-09 01:00 GMT",
  },

  {
    from: "2024-11-09 01:01 GMT",
    to: "2024-11-16 01:00 GMT",
  },

  {
    from: "2024-11-16 01:01 GMT",
    to: "2024-11-23 01:00 GMT",
  },

  {
    from: "2024-11-23 01:01 GMT",
    to: "2024-11-30 01:00 GMT",
  },

  // ----

  {
    from: "2024-12-01 00:00 GMT",
    to: "2024-12-07 01:00 GMT",
  },

  {
    from: "2024-12-07 01:01 GMT",
    to: "2024-12-14 01:00 GMT",
  },

  // TGE (18.12)
];
