import { Account } from "./Account";

export interface AccountOperation {
	account: Account;
	transaction?: undefined;
	violations?: string[];
}
