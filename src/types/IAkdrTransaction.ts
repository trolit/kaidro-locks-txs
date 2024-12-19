export interface IAkdrTransaction {
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  from: string; // 0x0000000000000000000000000000000000000000
  to: string;
  tokenSymbol: string;
  decimals: number;
  value: string;
  blockTime: number;
}
