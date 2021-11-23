import { AuthorizerPresenter } from "../AuthorizerPresenter";
import { Account } from "../../model/Account";

export class AuthorizerSimplePresenter implements AuthorizerPresenter {
	generateResponse(account: Account | {}, violations: string[]): Object {
		return JSON.stringify({ account, violations });
	}
}
