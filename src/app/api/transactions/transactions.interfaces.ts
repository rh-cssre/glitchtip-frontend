export interface Transaction {
  eventId: string;
  transaction: string;
  timestamp: string;
  startTimestamp: string;
}

export interface TransactionWithDelta extends Transaction {
  delta: number;
}
