<template>
  <el-container direction="vertical" class="app">
    <el-row :gutter="20" class="data">
      <el-col :span="6">
        <el-input
          v-model="walletAddress"
          placeholder="paste your wallet address, 0x..."
        />
      </el-col>

      <el-col :span="6">
        <el-button
          type="primary"
          @click="onSubmit"
          :loading="isLoading"
          :disabled="isWalletAddressEmpty"
        >
          Find my transactions
        </el-button>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="8">
        <transactions-summary :data="matchedAkdrTransactionsData">
          <template #header>
            A-KDR locks transactions<br />
            <el-link
              href="https://app.roninchain.com/token/0xe3c587e40e9b89b3f2af526c9d468d49a66e3c2d?p=1&ps=25"
              target="_blank"
              type="warning"
            >
              token
            </el-link>
          </template>
        </transactions-summary>
      </el-col>

      <el-col :span="8">
        <transactions-summary :data="matchedRonTransactionsData">
          <template #header>
            RON locks transactions<br />
            <el-link
              href="https://app.roninchain.com/address/0xfd7ee5e1dfa1990c3cc6742eaae4bcf1ff6b516e?p=1&ps=25"
              target="_blank"
              type="warning"
            >
              Kaidro Synergy Payments
            </el-link>
          </template>
        </transactions-summary>
      </el-col>
    </el-row>
  </el-container>
</template>

<script lang="ts">
import { debug } from "./helpers/debug";
import { sleep } from "@/helpers/sleep";
import myJsonData from "@/assets/01072024.json";
import { decodeAkdrValue } from "./helpers/decodeAkdrValue";
import { ITransactionSummary } from "./types/ITransactionSummary";
import { useHttpServiceStore } from "@/store/useHttpServiceStore";
import TransactionsSummary from "./components/TransactionsSummary.vue";
import {
  MAX_PAGES_TO_FETCH_LIMIT,
  DELAY_BETWEEN_EACH_REQUEST_IN_SECONDS,
  LAST_SYNERGY_BEFORE_TGE_TIMESTAMP_IN_SECONDS,
  TRANSACTION_HASH_OF_KAIDRO_REVERTING_SOME_AKDR,
} from "@/assets/constants";

export default {
  components: {
    TransactionsSummary,
  },

  data() {
    const httpService = useHttpServiceStore();

    return {
      httpService,
      walletAddress: "",
      isLoading: false,
      matchedTransactions: <ITransactionSummary[]>[],
    };
  },

  computed: {
    isWalletAddressEmpty() {
      return this.walletAddress.trim().length === 0;
    },

    matchedAkdrTransactionsData() {
      return this.matchedTransactions.filter(
        transaction => transaction.tokenSymbol === "A-KDR",
      );
    },

    matchedRonTransactionsData() {
      return this.matchedTransactions.filter(
        transaction => transaction.tokenSymbol === "RON",
      );
    },
  },

  methods: {
    async onSubmit() {
      this.isLoading = true;

      await this.fetchAkdrTransactions();

      this.fetchRonTransactions();

      this.isLoading = false;
    },

    async fetchRonTransactions() {
      for (const {
        UnixTimestamp,
        From,
        Status,
        Txhash,
        ValueIn,
      } of myJsonData) {
        // if transaction is later than last synergy week day timestamp
        // or wasn't sent from provided addr
        // or failed
        // - skip
        if (
          UnixTimestamp > LAST_SYNERGY_BEFORE_TGE_TIMESTAMP_IN_SECONDS ||
          From !== this.walletAddress ||
          Status !== "Success"
        ) {
          continue;
        }

        this.matchedTransactions.push({
          blockTime: UnixTimestamp,
          transactionHash: Txhash,
          value: ValueIn.toString(),
          tokenSymbol: "RON",
        });
      }
    },

    async fetchAkdrTransactions() {
      let page = 1;

      do {
        const transactions = await this.httpService.getAkdrLockTransactions(
          this.walletAddress,
          page,
        );

        if (!transactions.length) {
          debug("No more AKDR lock transactions, aborting further fetching..");

          break;
        }

        for (const {
          from,
          value,
          decimals,
          blockTime,
          tokenSymbol,
          transactionHash,
        } of transactions) {
          // if transaction is later than last synergy week day timestamp
          // or wasn't from provided wallet addr
          // or edge case
          // - skip
          if (
            from !== this.walletAddress ||
            blockTime > LAST_SYNERGY_BEFORE_TGE_TIMESTAMP_IN_SECONDS ||
            transactionHash === TRANSACTION_HASH_OF_KAIDRO_REVERTING_SOME_AKDR
          ) {
            continue;
          }

          this.matchedTransactions.push({
            blockTime,
            transactionHash,
            value: decodeAkdrValue(value, decimals),
            tokenSymbol,
          });
        }

        // sleep between each requests to not overload network
        await sleep(DELAY_BETWEEN_EACH_REQUEST_IN_SECONDS);

        page++;

        if (page > MAX_PAGES_TO_FETCH_LIMIT) {
          debug(
            "Max page limit reached! Aborting further AKDR transactions fetching.",
          );

          break;
        }
      } while (true);
    },
  },
};
</script>
