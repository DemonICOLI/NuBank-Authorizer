import { AuthorizerController } from "../AuthorizerController";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../../utils/Constants";
import { IAuthorizerService } from "../../service/IAuthorizerService";
import * as readline from "readline";

@injectable()
export class AuthorizerCLIController implements AuthorizerController {
	constructor(@inject(TYPES.AuthorizerService) private service: IAuthorizerService) {}

	handleEvent(): void {
		const readLine = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
			terminal: false,
		});
		const operations: any[] = [];
		readLine.on("line", (line) => {
			operations.push(JSON.parse(line));
		});

		readLine.on("close", async () => {
			await this.processOperations(operations);
		});
	}

	private async processOperations(operations: any[]) {
		for (const operation of operations) {
			console.log(await this.service.processOperation(operation));
		}
	}
}
