<template>
  <el-card shadow="always">
    <template #header>
      <slot name="header"> </slot>
    </template>

    <div v-if="data.length">
      <div
        v-for="(item, index) in data"
        :key="index"
        :style="{ display: 'flex', justifyContent: 'space-between' }"
      >
        {{ convertBlocktime(item.blockTime) }}

        <el-link
          :href="getHref(item.transactionHash)"
          target="_blank"
          type="primary"
        >
          view transaction
        </el-link>

        {{ item.value }} {{ item.tokenSymbol }}
      </div>
    </div>

    <em v-else>No data</em>
  </el-card>
</template>

<script lang="ts">
import { PropType } from "vue";
import { useDayjsStore } from "@/store/useDayjsStore";
import { ITransactionSummary } from "@/types/ITransactionSummary";

export default {
  props: {
    data: {
      type: Array as PropType<ITransactionSummary[]>,
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

    getHref(blockHash: string) {
      return `${this.TRANSACTION_DETAILS_URL}/${blockHash}`;
    },
  },
};
</script>
