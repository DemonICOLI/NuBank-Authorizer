import { AccountRepository } from "../AccountRepository";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Account } from "../../model/Account";
import { Transaction } from "../../model/Transaction";
import { TYPES } from "../../utils/Constants";
import { DateProvider } from "../../provider/DateProvider";

@injectable()
export class AccountInMemoryRepository implements AccountRepository {
	private account: Account | undefined;
	private transactions: Transaction[] = [];

	constructor(@inject(TYPES.DateProvider) private dateProvider: DateProvider) {}

	createAccount(account: Account): Account {
		this.account = Object.assign({}, account);
		return this.account;
	}

	getAccount(): Account | undefined {
		return this.account;
	}

	getNumberOfTransactionsInLastMinutes(transactionTime: string, intervalInMinutes: number): number {
		let dateNMinutesAgo = this.dateProvider.getDateNMinutesAgo(transactionTime, intervalInMinutes);
		return this.transactions.filter(
			(t) =>
				this.dateProvider.parseIsoDate(t.time) >= dateNMinutesAgo &&
				this.dateProvider.parseIsoDate(t.time) <= transactionTime
		).length;
	}

	hasTransactionOccurredInLastMinutes(transaction: Transaction, intervalInMinutes: number): boolean {
		let dateNMinutesAgo = this.dateProvider.getDateNMinutesAgo(transaction.time, intervalInMinutes);
		return (
			this.transactions
				.filter(
					(t) =>
						this.dateProvider.parseIsoDate(t.time) >= dateNMinutesAgo &&
						this.dateProvider.parseIsoDate(t.time) <= transaction.time
				)
				.filter((t) => t.merchant === transaction.merchant && t.amount === transaction.amount).length > 0
		);
	}

	processTransaction(transaction: Transaction): Account {
		if (this.account) {
			this.account["available-limit"] -= transaction.amount;
			this.transactions.push(transaction);
			return <Account>this.account;
		}
		throw new Error("Account does not exists");
	}
}
