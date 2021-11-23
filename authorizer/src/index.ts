import { AppContainer } from "./config/Config";
import { TYPES } from "./utils/Constants";
import { AuthorizerController } from "./controller/AuthorizerController";

let controllerInstance: AuthorizerController;

export function index(): void {
	controllerInstance = controllerInstance ?? AppContainer.get<AuthorizerController>(TYPES.AuthorizerController);
	return controllerInstance.handleEvent();
}

index();
