import axios from "axios";
import { defineStore } from "pinia";

import { IRonTransaction } from "@/types/IRonTransaction";
import { IAkdrTransaction } from "@/types/IAkdrTransaction";
import type { IResponseWrapper } from "@/types/IResponseWrapper";
import { getOffsetByPageNumber } from "@/helpers/getOffsetByPageNumber";

const TRANSACTIONS_PER_REQUEST_LIMIT = 100;

const BASE_URL = process.env.FARM_BASE_URL;
const KAIDRO_AKDR_ADDRESS = process.env.FARM_KAIDRO_AKDR_ADDRESS;
const KAIDRO_RON_ADDRESS = process.env.FARM_KAIDRO_RON_ADDRESS;

export const useHttpServiceStore = defineStore("useHttpServiceStore", () => {
  return {
    async getAkdrLockTransactions(walletAddress: string, page = 1) {
      const {
        data: {
          result: { items },
        },
      } = await axios.get<IResponseWrapper<IAkdrTransaction>>(
        `${BASE_URL}/accounts/${walletAddress}/tokens/${KAIDRO_AKDR_ADDRESS}/transfers`,
        {
          params: {
            offset: getOffsetByPageNumber(page, TRANSACTIONS_PER_REQUEST_LIMIT),
            limit: TRANSACTIONS_PER_REQUEST_LIMIT,
          },
        },
      );

      return items;
    },

    // @DEPRECATED
    async getRonLockTransactions(page = 1) {
      const {
        data: {
          result: { items },
        },
      } = await axios.get<IResponseWrapper<IRonTransaction>>(
        `${BASE_URL}/accounts/${KAIDRO_RON_ADDRESS}/txs`,
        {
          params: {
            offset: getOffsetByPageNumber(page, TRANSACTIONS_PER_REQUEST_LIMIT),
            limit: TRANSACTIONS_PER_REQUEST_LIMIT,
          },
        },
      );

      return items;
    },
  };
});
