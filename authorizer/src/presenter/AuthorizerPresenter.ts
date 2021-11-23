import { Account } from "../model/Account";

export interface AuthorizerPresenter {
	generateResponse(account: Account | {}, violations: string[]): object;
}
