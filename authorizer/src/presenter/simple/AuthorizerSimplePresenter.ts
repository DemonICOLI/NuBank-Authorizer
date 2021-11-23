import { AuthorizerPresenter } from "../AuthorizerPresenter";
import { Account } from "../../model/Account";

export class AuthorizerSimplePresenter implements AuthorizerPresenter {
	generateResponse(account: Account | {}, violations: string[]): object {
		return { account, violations };
	}
}
