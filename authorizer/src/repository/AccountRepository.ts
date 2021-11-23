import { Account } from "../model/Account";
import { Transaction } from "../model/Transaction";

export interface AccountRepository {
	createAccount(account: Account): Account;
	getAccount(): Account | undefined;
	getNumberOfTransactionsInLastMinutes(transactionTime: string, intervalInMinutes: number): number;
	hasTransactionOccurredInLastMinutes(transaction: Transaction, intervalInMinutes: number): boolean;
	processTransaction(transaction: Transaction): Account;
}
