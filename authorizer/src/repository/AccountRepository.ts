import { Account } from "../model/Account";

export interface AccountRepository {
	createAccount(account: Account): void;
	getAccount(): Account | undefined;
}
