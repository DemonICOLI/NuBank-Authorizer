import { Account } from "./Account";

export interface OperationResponse {
	account: Account | {};
	violations: string[];
}
