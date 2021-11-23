import { AccountInMemoryRepository } from "../../../src/repository/in-memory/AccountInMemoryRepository";
import { DateProvider } from "../../../src/provider/DateProvider";
import { Mock } from "ts-mocks";
import { LuxonDateProvider } from "../../../src/provider/luxon/LuxonDateProvider";

describe("AccountInMemoryRepository Test Suite", () => {
	it("createAccount should return the account created", () => {
		const dateProviderMock = new Mock<DateProvider>({
			getDateNMinutesAgo(isoDate: string, minutesToSubtract: number): string {
				return "";
			},
		}).Object;
		const repository = new AccountInMemoryRepository(dateProviderMock);
		const account = {
			"active-card": false,
			"available-limit": 100,
		};
		const createdAccount = repository.createAccount(account);
		expect(createdAccount).toEqual(account);
	});

	it("getAccount should return the account previously created", () => {
		const dateProviderMock = new Mock<DateProvider>({
			getDateNMinutesAgo(isoDate: string, minutesToSubtract: number): string {
				return "";
			},
		}).Object;
		const repository = new AccountInMemoryRepository(dateProviderMock);
		const account = {
			"active-card": false,
			"available-limit": 100,
		};
		repository.createAccount(account);
		const createdAccount = repository.getAccount();
		expect(createdAccount).toEqual(account);
	});

	it("getAccount should return undefined if no account has been created", () => {
		const dateProviderMock = new Mock<DateProvider>({
			getDateNMinutesAgo(isoDate: string, minutesToSubtract: number): string {
				return "";
			},
		}).Object;
		const repository = new AccountInMemoryRepository(dateProviderMock);
		const createdAccount = repository.getAccount();
		expect(createdAccount).toBeUndefined();
	});

	it("processTransaction should throw if no account has been created", () => {
		const dateProviderMock = new Mock<DateProvider>({
			getDateNMinutesAgo(isoDate: string, minutesToSubtract: number): string {
				return "";
			},
		}).Object;
		const repository = new AccountInMemoryRepository(dateProviderMock);
		const transaction = { merchant: "Samsung", amount: 100, time: "2019-02-13T11:00:01.000Z" };
		expect(() => {
			repository.processTransaction(transaction);
		}).toThrow(new Error("Account does not exists"));
	});

	it("processTransaction should return account with new balance", () => {
		const dateProviderMock = new Mock<DateProvider>({
			getDateNMinutesAgo(isoDate: string, minutesToSubtract: number): string {
				return "";
			},
		}).Object;
		const repository = new AccountInMemoryRepository(dateProviderMock);
		const account = {
			"active-card": false,
			"available-limit": 100,
		};
		repository.createAccount(account);
		const transaction = { merchant: "Samsung", amount: 100, time: "2019-02-13T11:00:01.000Z" };
		const accountAfter = repository.processTransaction(transaction);
		expect(accountAfter["available-limit"]).toBe(0);
	});

	it("hasTransactionOccurredInLastMinutes should return false if transaction hasn't ocurred in last interval", () => {
		const repository = new AccountInMemoryRepository(new LuxonDateProvider());
		const account = {
			"active-card": false,
			"available-limit": 100,
		};
		repository.createAccount(account);
		const transaction = { merchant: "Samsung", amount: 100, time: "2019-02-13T11:00:01.000Z" };
		const hasOccurred = repository.hasTransactionOccurredInLastMinutes(transaction, 2);
		expect(hasOccurred).toBe(false);
	});

	it("hasTransactionOccurredInLastMinutes should return true if transaction has ocurred in last interval", () => {
		const repository = new AccountInMemoryRepository(new LuxonDateProvider());
		const account = {
			"active-card": false,
			"available-limit": 100,
		};
		repository.createAccount(account);
		repository.processTransaction({ merchant: "Samsung", amount: 100, time: "2019-02-13T11:01:01.000Z" });
		const transaction = { merchant: "Samsung", amount: 100, time: "2019-02-13T11:00:01.000Z" };
		const hasOccurred = repository.hasTransactionOccurredInLastMinutes(transaction, 2);
		expect(hasOccurred).toBe(true);
	});

	it("getNumberOfTransactionsInLastMinutes should return number of transaction that ocurred in last interval", () => {
		const repository = new AccountInMemoryRepository(new LuxonDateProvider());
		const account = {
			"active-card": false,
			"available-limit": 100,
		};
		repository.createAccount(account);
		repository.processTransaction({ merchant: "Samsung", amount: 100, time: "2019-02-13T11:01:01.000Z" });
		const hasOccurred = repository.getNumberOfTransactionsInLastMinutes("2019-02-13T11:00:01.000Z", 2);
		expect(hasOccurred).toBe(1);
	});
});
