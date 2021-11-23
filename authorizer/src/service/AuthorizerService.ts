import { inject, injectable } from "inversify";
import { CONSTANTS, ERROR_MESSAGES, TYPES } from "../utils/Constants";
import { AccountRepository } from "../repository/AccountRepository";
import "reflect-metadata";
import { AccountOperation } from "../model/AccountOperation";
import { Account } from "../model/Account";
import { OperationResponse } from "../model/OperationResponse";
import { TransactionOperation } from "../model/TransactionOperation";
import { AuthorizerPresenter } from "../presenter/AuthorizerPresenter";
import { Transaction } from "../model/Transaction";

@injectable()
export class AuthorizerService {
	constructor(
		@inject(TYPES.AccountRepository) private accountRepository: AccountRepository,
		@inject(TYPES.AuthorizerPresenter) private presenter: AuthorizerPresenter
	) {}

	public async processOperation(operation: AccountOperation | TransactionOperation): Promise<object> {
		let account, violations;
		if ("account" in operation) {
			({ account, violations } = this.processAccountOperation(<AccountOperation>operation));
		} else {
			({ account, violations } = await this.processTransactionOperation(operation));
		}
		return this.presenter.generateResponse(account, violations);
	}

	private processAccountOperation(accountOperation: AccountOperation) {
		let account = this.accountRepository.getAccount();
		let violations: string[] = [];
		if (account) {
			violations.push(ERROR_MESSAGES.ACCOUNT_ALREADY_INITIALIZED);
		} else {
			account = this.accountRepository.createAccount(accountOperation.account);
		}
		return { account, violations };
	}

	private async processTransactionOperation(transactionOperation: TransactionOperation) {
		let account: Account | undefined | {} = this.accountRepository.getAccount();
		let violations: string[] = [];
		if (account) {
			violations = violations.concat(
				await this.getTransactionViolations(<Account>account, transactionOperation.transaction)
			);
			if (violations.length == 0) {
				account = this.accountRepository.processTransaction(transactionOperation.transaction);
			}
		} else {
			account = {};
			violations.push(ERROR_MESSAGES.ACCOUNT_NOT_INITIALIZED);
		}
		return { account, violations };
	}

	private async getTransactionViolations(account: Account, transaction: Transaction): Promise<string[]> {
		let validationPromises = [
			this.validateAccountCardActive(account),
			this.validateAccountBalanceForTransaction(account, transaction),
			this.validateHighFrequencySmallInterval(transaction),
			this.validateDoubledTransaction(transaction),
		];
		// @ts-ignore
		return (await Promise.all(validationPromises)).filter((e) => e);
	}

	private async validateAccountCardActive(account: Account) {
		return account["active-card"] ? undefined : ERROR_MESSAGES.CARD_NOT_ACTIVE;
	}

	private async validateAccountBalanceForTransaction(account: Account, transaction: Transaction) {
		return account["available-limit"] - transaction.amount >= 0 ? undefined : ERROR_MESSAGES.INSUFFICIENT_LIMIT;
	}

	private async validateHighFrequencySmallInterval(transaction: Transaction) {
		const numberOfTransactionsInLastMinutes = this.accountRepository.getNumberOfTransactionsInLastMinutes(
			transaction.time,
			CONSTANTS.SMALL_INTERVAL
		);
		return numberOfTransactionsInLastMinutes < CONSTANTS.MAX_NUMBER_OF_TRANSACTIONS_IN_SMALL_INTERVAL
			? undefined
			: ERROR_MESSAGES.HIGH_FREQUENCY_SMALL_INTERVAL;
	}

	private async validateDoubledTransaction(transaction: Transaction) {
		return this.accountRepository.hasTransactionOccurredInLastMinutes(transaction, CONSTANTS.SMALL_INTERVAL)
			? ERROR_MESSAGES.DOUBLED_TRANSACTION
			: undefined;
	}
}
