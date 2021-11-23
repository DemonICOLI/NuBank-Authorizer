import { AccountRepository } from "../../src/repository/AccountRepository";
import { Mock } from "ts-mocks";
import { Account } from "../../src/model/Account";
import { AuthorizerService } from "../../src/service/AuthorizerService";
import { ERROR_MESSAGES, CONSTANTS } from "../../src/utils/Constants";
import { Transaction } from "../../src/model/Transaction";
import { AuthorizerPresenter } from "../../src/presenter/AuthorizerPresenter";

describe("AuthorizerService Test Suite", () => {
	it("Create an account with no previous existing account should call presenter with account and no violations", async () => {
		const accountRepository = new Mock<AccountRepository>({
			getAccount: () => {
				return undefined;
			},
			createAccount(account: Account) {
				return account;
			},
		}).Object;

		const presenterMock = {
			generateResponse(account: Account, violations: string[]) {
				return {};
			},
		};
		spyOn(presenterMock, "generateResponse");

		const service = new AuthorizerService(accountRepository, presenterMock);
		const mockOperation = { account: { "active-card": false, "available-limit": 750 } };
		const response = await service.processOperation(mockOperation);

		expect(presenterMock.generateResponse).toHaveBeenCalledOnceWith(
			{ "active-card": false, "available-limit": 750 },
			[]
		);
	});

	it("Create an account with a previous existing account should call presenter with Account Initialized in violations", async () => {
		const accountRepository = new Mock<AccountRepository>({
			getAccount: () => {
				return {
					"active-card": false,
					"available-limit": 100,
				};
			},
			createAccount(account: Account) {
				return account;
			},
		}).Object;

		const presenterMock = {
			generateResponse(account: Account, violations: string[]) {
				return {};
			},
		};
		spyOn(presenterMock, "generateResponse");

		const service = new AuthorizerService(accountRepository, presenterMock);
		const mockOperation = { account: { "active-card": false, "available-limit": 750 } };
		const response = await service.processOperation(mockOperation);

		expect(presenterMock.generateResponse).toHaveBeenCalledOnceWith(
			{ "active-card": false, "available-limit": 100 },
			[ERROR_MESSAGES.ACCOUNT_ALREADY_INITIALIZED]
		);
	});

	it("Process a transaction with no account should call presenter with Account not Initialized in violations", async () => {
		const accountRepository = new Mock<AccountRepository>({
			getAccount: () => {
				return undefined;
			},
			createAccount(account: Account) {
				return account;
			},
		}).Object;

		const presenterMock = {
			generateResponse(account: Account | {}, violations: string[]) {
				return {};
			},
		};
		spyOn(presenterMock, "generateResponse");
		const service = new AuthorizerService(accountRepository, presenterMock);
		const mockOperation = { transaction: { merchant: "Uber Eats", amount: 25, time: "2020-12-01T11:07:00.000Z" } };
		const response = await service.processOperation(mockOperation);

		expect(presenterMock.generateResponse).toHaveBeenCalledOnceWith({}, [ERROR_MESSAGES.ACCOUNT_NOT_INITIALIZED]);
	});

	it("Process a transaction in an account with an inactive card should call presenter with Card not active in violations", async () => {
		const accountRepository = new Mock<AccountRepository>({
			getAccount: () => {
				return {
					"active-card": false,
					"available-limit": 100,
				};
			},
			createAccount(account: Account) {
				return account;
			},
			getNumberOfTransactionsInLastMinutes(lastMinutes: number) {
				return 0;
			},
			hasTransactionOccurredInLastMinutes(transaction: Transaction, intervalInMinutes: number) {
				return false;
			},
		}).Object;

		const presenterMock = {
			generateResponse(account: Account | {}, violations: string[]) {
				return {};
			},
		};
		spyOn(presenterMock, "generateResponse");
		const service = new AuthorizerService(accountRepository, presenterMock);
		const mockOperation = { transaction: { merchant: "Uber Eats", amount: 25, time: "2020-12-01T11:07:00.000Z" } };
		const response = await service.processOperation(mockOperation);

		expect(presenterMock.generateResponse).toHaveBeenCalledOnceWith(
			{
				"active-card": false,
				"available-limit": 100,
			},
			jasmine.arrayContaining([ERROR_MESSAGES.CARD_NOT_ACTIVE])
		);
	});

	it("Process a transaction without funds should call presenter with insufficient limits in violations", async () => {
		const accountRepository = new Mock<AccountRepository>({
			getAccount: () => {
				return { "active-card": true, "available-limit": 1000 };
			},
			createAccount(account: Account) {
				return account;
			},
			getNumberOfTransactionsInLastMinutes(lastMinutes: number) {
				return 0;
			},
			hasTransactionOccurredInLastMinutes(transaction: Transaction, intervalInMinutes: number) {
				return false;
			},
		}).Object;

		const presenterMock = {
			generateResponse(account: Account | {}, violations: string[]) {
				return {};
			},
		};
		spyOn(presenterMock, "generateResponse");
		const service = new AuthorizerService(accountRepository, presenterMock);
		const mockOperation = { transaction: { merchant: "Samsung", amount: 2500, time: "2019-02-13T11:00:01.000Z" } };
		const response = await service.processOperation(mockOperation);

		expect(presenterMock.generateResponse).toHaveBeenCalledOnceWith(
			{
				"active-card": true,
				"available-limit": 1000,
			},
			jasmine.arrayContaining([ERROR_MESSAGES.INSUFFICIENT_LIMIT])
		);
	});

	it("Process a transaction over the limit in the small interval should call presenter with high frequency small interval in violations", async () => {
		const accountRepository = new Mock<AccountRepository>({
			getAccount: () => {
				return { "active-card": true, "available-limit": 1000 };
			},
			createAccount(account: Account) {
				return account;
			},
			getNumberOfTransactionsInLastMinutes(lastMinutes: number) {
				return CONSTANTS.MAX_NUMBER_OF_TRANSACTIONS_IN_SMALL_INTERVAL;
			},
			hasTransactionOccurredInLastMinutes(transaction: Transaction, intervalInMinutes: number) {
				return false;
			},
		}).Object;

		const presenterMock = {
			generateResponse(account: Account | {}, violations: string[]) {
				return {};
			},
		};
		spyOn(presenterMock, "generateResponse");
		const service = new AuthorizerService(accountRepository, presenterMock);
		const mockOperation = { transaction: { merchant: "Samsung", amount: 100, time: "2019-02-13T11:00:01.000Z" } };
		const response = await service.processOperation(mockOperation);

		expect(presenterMock.generateResponse).toHaveBeenCalledOnceWith(
			{
				"active-card": true,
				"available-limit": 1000,
			},
			jasmine.arrayContaining([ERROR_MESSAGES.HIGH_FREQUENCY_SMALL_INTERVAL])
		);
	});

	it("Process a transaction that has occurred in the last small interval should call presenter with doubled transaction in violations", async () => {
		const accountRepository = new Mock<AccountRepository>({
			getAccount: () => {
				return { "active-card": true, "available-limit": 1000 };
			},
			createAccount(account: Account) {
				return account;
			},
			getNumberOfTransactionsInLastMinutes(lastMinutes: number) {
				return 1;
			},
			hasTransactionOccurredInLastMinutes(transaction: Transaction, intervalInMinutes: number) {
				return true;
			},
		}).Object;

		const presenterMock = {
			generateResponse(account: Account | {}, violations: string[]) {
				return {};
			},
		};
		spyOn(presenterMock, "generateResponse");
		const service = new AuthorizerService(accountRepository, presenterMock);
		const mockOperation = { transaction: { merchant: "Samsung", amount: 100, time: "2019-02-13T11:00:01.000Z" } };
		const response = await service.processOperation(mockOperation);

		expect(presenterMock.generateResponse).toHaveBeenCalledOnceWith(
			{
				"active-card": true,
				"available-limit": 1000,
			},
			jasmine.arrayContaining([ERROR_MESSAGES.DOUBLED_TRANSACTION])
		);
	});

	it("Process a valid transaction should call process transaction", async () => {
		const presenter = new Mock<AuthorizerPresenter>({
			generateResponse(account: Account | {}, violations: string[]) {
				return {};
			},
		}).Object;

		const accountRepositoryMock = {
			getAccount: () => {
				return { "active-card": true, "available-limit": 1000 };
			},
			createAccount(account: Account) {
				return account;
			},
			getNumberOfTransactionsInLastMinutes(lastMinutes: number) {
				return 1;
			},
			hasTransactionOccurredInLastMinutes(transaction: Transaction, intervalInMinutes: number) {
				return false;
			},
			processTransaction(transaction: Transaction) {
				return { "active-card": true, "available-limit": 1000 };
			},
		};
		spyOn(accountRepositoryMock, "processTransaction");
		const service = new AuthorizerService(accountRepositoryMock, presenter);
		const mockOperation = { transaction: { merchant: "Samsung", amount: 100, time: "2019-02-13T11:00:01.000Z" } };
		const response = await service.processOperation(mockOperation);

		expect(accountRepositoryMock.processTransaction).toHaveBeenCalled();
	});
});
