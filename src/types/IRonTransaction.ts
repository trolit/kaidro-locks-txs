export interface IRonTransaction {
  transactionHash: string; // TxHash
  blockNumber: number; // Blockno
  from: string;
  to: string;
  value: string; // ValueIn
  blockTime: number; // UnixTimestamp
}
