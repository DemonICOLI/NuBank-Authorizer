export const ERROR_MESSAGES = {
	ACCOUNT_ALREADY_INITIALIZED: "account-already-initialized",
	ACCOUNT_NOT_INITIALIZED: "account-not-initialized",
	CARD_NOT_ACTIVE: "card-not-active",
	INSUFFICIENT_LIMIT: "insufficient-limit",
	HIGH_FREQUENCY_SMALL_INTERVAL: "high-frequency-small-interval",
	DOUBLED_TRANSACTION: "doubled-transaction",
};

export const TYPES = {
	AccountRepository: Symbol.for("AccountRepository"),
	AuthorizerPresenter: Symbol.for("AuthorizerPresenter"),
	DateProvider: Symbol.for("DateProvider"),
};

export const CONSTANTS = {
	SMALL_INTERVAL: 2,
	MAX_NUMBER_OF_TRANSACTIONS_IN_SMALL_INTERVAL: 3,
};
