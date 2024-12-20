<template>
  <el-link :href="getHref(transactionHash)" target="_blank" type="primary">
    {{ text }}
  </el-link>
</template>

<script lang="ts">
export default {
  props: {
    transactionHash: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: false,
      default: () => "txs",
    },
  },

  data() {
    const TX_URL = process.env.FARM_TX_URL;

    return {
      TRANSACTION_DETAILS_URL: TX_URL,
    };
  },

  methods: {
    getHref(blockHash: string) {
      return `${this.TRANSACTION_DETAILS_URL}/${blockHash}`;
    },
  },
};
</script>
