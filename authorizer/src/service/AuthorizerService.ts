import { inject, injectable } from "inversify";
import { ERROR_MESSAGES, TYPES } from "../utils/Constants";
import { AccountRepository } from "../repository/AccountRepository";
import "reflect-metadata";
import { AccountOperation } from "../model/AccountOperation";
import { Account } from "../model/Account";

@injectable()
export class AuthorizerService {
	constructor(@inject(TYPES.AccountRepository) private accountRepository: AccountRepository) {}

	public processOperation(operation: AccountOperation): AccountOperation {
		return this.processAccountOperation(operation);
	}

	private processAccountOperation(accountOperation: AccountOperation): AccountOperation {
		const currentAccount = this.accountRepository.getAccount();
		let violations: string[] = [];
		if (currentAccount) {
			violations.push(ERROR_MESSAGES.ACCOUNT_ALREADY_INITIALIZED);
		} else {
			this.accountRepository.createAccount(accountOperation.account);
		}
		const response = Object.assign({}, accountOperation);
		response.violations = violations;
		return response;
	}
}
