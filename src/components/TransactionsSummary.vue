<template>
  <el-card shadow="always">
    <template #header>
      <slot name="header"> </slot>
    </template>

    <em v-if="isLoading">Loading...</em>

    <div v-else-if="data.length">
      <div
        v-for="(item, index) in data"
        :key="index"
        :style="{ display: 'flex', justifyContent: 'space-between' }"
      >
        {{ convertBlocktime(item.blockTime) }}

        <div :style="{ display: 'flex', gap: '10px' }">
          {{ item.value }} {{ item.tokenSymbol }}

          <transaction-href
            :transaction-hash="item.transactionHash"
            text="txs"
          />
        </div>
      </div>
    </div>

    <em v-else>No data</em>

    <template v-if="withFooter" #footer>
      <slot name="footer"></slot>
    </template>
  </el-card>
</template>

<script lang="ts">
import { PropType } from "vue";
import TransactionHref from "./TransactionHref.vue";
import { useDayjsStore } from "@/store/useDayjsStore";
import { ITransactionSummary } from "@/types/ITransactionSummary";

export default {
  components: {
    TransactionHref,
  },

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    data: {
      type: Array as PropType<ITransactionSummary[]>,
      required: true,
    },

    withFooter: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    const TX_URL = process.env.FARM_TX_URL;

    const dayjsStore = useDayjsStore();

    return {
      dayjsStore,
      TRANSACTION_DETAILS_URL: TX_URL,
    };
  },

  methods: {
    convertBlocktime(blockTime: number) {
      return this.dayjsStore.blockTimeToDate(blockTime);
    },
  },
};
</script>
