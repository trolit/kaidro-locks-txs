<template>
  <el-container direction="vertical" class="app">
    <small>
      This tool lists locks purchases made with either RON or A-KDR up to
      <strong>14 December 2024</strong> (last synergy week before TGE)

      <br />
      <div class="vertical-center">
        source code/repository:
        <el-link
          href="https://github.com/trolit/kaidro-locks-txs"
          target="_blank"
          type="primary"
        >
          https://github.com/trolit/kaidro-locks-txs
        </el-link>
      </div>
    </small>

    <el-row :gutter="18" class="data">
      <el-col :xs="18" :sm="18" :md="18" :lg="5" :xl="5">
        <el-input
          v-model="walletAddress"
          placeholder="paste your wallet address, 0x..."
        />
      </el-col>

      <el-col :xs="18" :sm="18" :md="18" :lg="5" :xl="5">
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

    <el-row :gutter="18">
      <el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5">
        <transactions-summary
          with-footer
          :is-loading="isLoading"
          :data="matchedAkdrTransactionsData"
        >
          <template #header>
            A-KDR locks transactions<br />
            <el-link
              href="https://app.roninchain.com/token/0xe3c587e40e9b89b3f2af526c9d468d49a66e3c2d?p=1&ps=25"
              target="_blank"
              type="primary"
            >
              token
            </el-link>
          </template>

          <template #footer>
            <el-text size="small" type="warning">
              Warning: Skynet REST API used to get A-KDR transactions is set to
              be deprecated on 31/12/2024!
            </el-text>
          </template>
        </transactions-summary>
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5">
        <transactions-summary
          with-footer
          :is-loading="isLoading"
          :data="matchedRonTransactionsData"
        >
          <template #header>
            RON locks transactions<br />
            <el-link
              href="https://app.roninchain.com/address/0xfd7ee5e1dfa1990c3cc6742eaae4bcf1ff6b516e?p=1&ps=25"
              target="_blank"
              type="primary"
            >
              Kaidro Synergy Payments
            </el-link>
          </template>

          <template #footer>
            <el-text size="small" type="info">
              Considering data between 01/07/2024 and 14/12/2024 (last synergy
              week before TGE)
            </el-text>
          </template>
        </transactions-summary>
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <synergy-summary :is-loading="isLoading" :data="matchedTransactions" />
      </el-col>
    </el-row>

    <footer>
      This tool is not associated with Kaidro team. Do not consider output as
      final evidence in missing A-KDR.
    </footer>
  </el-container>
</template>

<script lang="ts">
import { debug } from "./helpers/debug";
import { sleep } from "@/helpers/sleep";
import myJsonData from "@/assets/01072024.json";
import { decodeAkdrValue } from "./helpers/decodeAkdrValue";
import SynergySummary from "./components/SynergySummary.vue";
import { ITransactionSummary } from "./types/ITransactionSummary";
import { useHttpServiceStore } from "@/store/useHttpServiceStore";
import TransactionsSummary from "./components/TransactionsSummary.vue";
import {
  MAX_PAGES_TO_FETCH_LIMIT,
  DELAY_BETWEEN_EACH_REQUEST_IN_SECONDS,
  LAST_SYNERGY_BEFORE_TGE_TIMESTAMP_IN_SECONDS,
  TRANSACTION_HASH_OF_KAIDRO_REVERTING_SOME_AKDR,
} from "@/assets/constants";
import { useDayjsStore } from "./store/useDayjsStore";

export default {
  components: {
    SynergySummary,
    TransactionsSummary,
  },

  data() {
    const dayjsStore = useDayjsStore();
    const httpService = useHttpServiceStore();

    return {
      dayjsStore,
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
    reset() {
      this.matchedTransactions = [];
    },

    async onSubmit() {
      this.isLoading = true;

      this.reset();

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
