import { AccountRepository } from "../../src/repository/AccountRepository";
import { Mock } from "ts-mocks";
import { Account } from "../../src/model/Account";
import { AuthorizerService } from "../../src/service/AuthorizerService";
import { ERROR_MESSAGES } from "../../src/utils/Constants";

describe("AuthorizerService Test Suite", () => {
	describe("Success Test Cases", () => {
		it("Create an account with no previous existing account should not return violations", () => {
			const accountRepository = new Mock<AccountRepository>({
				getAccount: () => {
					return undefined;
				},
				createAccount(account: Account) {
					return;
				},
			}).Object;

			const service = new AuthorizerService(accountRepository);
			const mockOperation = { account: { "active-card": false, "available-limit": 750 } };
			const response = service.processOperation(mockOperation);

			expect((<string[]>response.violations).length).toBe(0);
		});

		it("Create an account with a previous existing account should return Account Initialized in violations", () => {
			const accountRepository = new Mock<AccountRepository>({
				getAccount: () => {
					return {
						"active-card": false,
						"available-limit": 100,
					};
				},
				createAccount(account: Account) {
					return;
				},
			}).Object;

			const service = new AuthorizerService(accountRepository);
			const mockOperation = { account: { "active-card": false, "available-limit": 750 } };
			const response = service.processOperation(mockOperation);

			expect(<string[]>response.violations).toContain(ERROR_MESSAGES.ACCOUNT_ALREADY_INITIALIZED);
		});
	});
});
