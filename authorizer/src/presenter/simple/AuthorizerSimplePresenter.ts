import { AuthorizerPresenter } from "../AuthorizerPresenter";
import { Account } from "../../model/Account";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class AuthorizerSimplePresenter implements AuthorizerPresenter {
	generateResponse(account: Account | {}, violations: string[]): Object {
		return JSON.stringify({ account, violations });
	}
}
