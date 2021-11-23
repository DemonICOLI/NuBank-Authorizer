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

		readLine.on("line", (line) => {
			this.service.processOperation(JSON.parse(line)).then((response) => console.log(response));
		});
	}
}
