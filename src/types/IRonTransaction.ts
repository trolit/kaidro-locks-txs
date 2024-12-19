export interface IRonTransaction {
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  status: number; // 1 = success
  from: string;
  to: string;
  value: string;
  blockTime: number;
}
