<template>
  <el-card shadow="always">
    <template #header>
      Your synergy summary<br />
      <el-text type="info" size="small">
        *based on collected lock purchases</el-text
      >
    </template>

    <em v-if="isLoading">Loading...</em>

    <em v-else-if="!data.length">No data</em>

    <el-scrollbar v-else height="400px">
      <el-row
        :gutter="20"
        v-for="(
          { from, to, label, transactions }, synergyWeekIndex
        ) in summaryData"
        :key="synergyWeekIndex"
        :style="{ padding: 0, margin: 0 }"
      >
        <el-col :span="10">
          <small>
            <el-text size="small" type="warning">
              Week {{ synergyWeekIndex + 1 }}
            </el-text>
            <br />
            {{ from }} GMT <br />
            {{ to }} GMT
          </small>
        </el-col>

        <el-col :span="10">
          <el-text
            v-if="transactions.length"
            size="small"
            v-for="(transaction, tranasctionIndex) in transactions"
            :key="tranasctionIndex"
          >
            <transaction-href
              :transaction-hash="transaction.transactionHash"
              :text="`txs${tranasctionIndex + 1}&nbsp;`"
            />
          </el-text>

          <el-text v-else>{{ label }}</el-text>
        </el-col>

        <el-divider v-if="!isLastElement(synergyWeekIndex)" />
      </el-row>
    </el-scrollbar>
  </el-card>
</template>

<script lang="ts">
import { PropType } from "vue";
import TransactionHref from "./TransactionHref.vue";
import { useDayjsStore } from "@/store/useDayjsStore";
import { RAW_SYNERGY_WEEKS } from "@/assets/constants";
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
  },

  data() {
    const dayjsStore = useDayjsStore();

    return {
      dayjsStore,
    };
  },

  computed: {
    translatedSynergyWeeks() {
      return RAW_SYNERGY_WEEKS.map(({ from, to }) => {
        return {
          from: this.dayjsStore.parseToTimezoneAndFormat(from),
          to: this.dayjsStore.parseToTimezoneAndFormat(to),

          fromUnix: this.dayjsStore.getTimestampInSeconds(from),
          toUnix: this.dayjsStore.getTimestampInSeconds(to),
        };
      });
    },

    summaryData() {
      let isFirstSynergy = false;

      return this.translatedSynergyWeeks.map(
        ({ from, to, fromUnix, toUnix }) => {
          let label = "N/A";
          const transactions = this.getTransactions(fromUnix, toUnix);

          if (transactions.length !== 0) {
            isFirstSynergy = true;
          } else if (transactions.length === 0 && isFirstSynergy) {
            label = "Missed";
          } else {
            label = "Not participated";
          }

          return {
            from,
            to,
            label,
            transactions,
          };
        },
      );
    },
  },

  methods: {
    convertBlocktime(blockTime: number) {
      return this.dayjsStore.blockTimeToDate(blockTime);
    },

    isLastElement(index: number) {
      return this.translatedSynergyWeeks.length - 1 === index;
    },

    getTransactions(fromUnix: number, toUnix: number) {
      return this.data.filter(transactionSummary => {
        console.log(
          `${fromUnix} - ${transactionSummary.blockTime} - ${toUnix}`,
        );

        return (
          transactionSummary.blockTime > fromUnix &&
          transactionSummary.blockTime <= toUnix
        );
      });
    },
  },
};
</script>
