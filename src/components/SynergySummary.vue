<template>
  <el-card shadow="always">
    <template #header>
      Your synergy summary<br />
      <el-text type="info" size="small">
        *based on collected lock purchases
      </el-text>
      <br />
      <div v-if="data.length && !hasParticipatedInAllSynergyWeeks">
        <el-switch v-model="areNotParticipatedWeeksVisible" />&nbsp;

        <el-text size="small">
          {{ switchText }} synergy weeks before conducting first synergy
        </el-text>
      </div>
    </template>

    <em v-if="isLoading">Loading...</em>

    <em v-else-if="!data.length">No data</em>

    <el-scrollbar v-else height="400px">
      <el-row
        class="synergy-week"
        :gutter="20"
        v-for="(
          { from, to, label, transactions }, synergyWeekIndex
        ) in summaryData"
        :key="synergyWeekIndex"
        :style="{ padding: 0, margin: 0 }"
      >
        <el-col :span="10" class="range">
          <small>
            <el-text size="small" type="warning">
              Week {{ synergyWeekIndex + 1 }}
            </el-text>
            <br />
            {{ from }} GMT <br />
            {{ to }} GMT
          </small>
        </el-col>

        <el-col :span="10" class="transactions">
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

        <div class="space" v-if="!isLastElement(synergyWeekIndex)" />
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
      hasParticipatedInAllSynergyWeeks: true,
      areNotParticipatedWeeksVisible: false,
    };
  },

  computed: {
    switchText() {
      return this.areNotParticipatedWeeksVisible ? "Hide" : "Show";
    },

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

      const synergyWeeks: any = [];

      this.translatedSynergyWeeks.map(({ from, to, fromUnix, toUnix }) => {
        let label = "N/A";
        const transactions = this.getTransactions(fromUnix, toUnix);

        if (transactions.length !== 0) {
          isFirstSynergy = true;
        } else if (transactions.length === 0 && isFirstSynergy) {
          label = "Missed";
        } else {
          label = "Not participated";
        }

        if (label === "Not participated") {
          this.hasParticipatedInAllSynergyWeeks = false;

          if (!this.areNotParticipatedWeeksVisible) {
            return;
          }
        }

        synergyWeeks.push({
          from,
          to,
          label,
          transactions,
        });
      });

      return synergyWeeks;
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
        return (
          transactionSummary.blockTime > fromUnix &&
          transactionSummary.blockTime <= toUnix
        );
      });
    },
  },
};
</script>
