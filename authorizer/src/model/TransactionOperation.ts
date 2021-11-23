import { Transaction } from "./Transaction";

export interface TransactionOperation {
	account?: undefined;
	transaction: Transaction;
}
