import { AccountOperation } from "../model/AccountOperation";
import { TransactionOperation } from "../model/TransactionOperation";

export interface IAuthorizerService {
	processOperation(operation: AccountOperation | TransactionOperation): Promise<object>;
}