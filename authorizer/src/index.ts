import { AppContainer } from "./config/Config";
import { TYPES } from "./utils/Constants";
import { AuthorizerController } from "./controller/AuthorizerController";

let controllerInstance: AuthorizerController;

export function index(event: object, context: object): void {
	try {
		controllerInstance = controllerInstance ?? AppContainer.get<AuthorizerController>(TYPES.AuthorizerController);
		return controllerInstance.handleEvent();
	} catch (error) {
		console.error("Error en la ejecución de la funcion: %o", error);
		throw error;
	} finally {
		console.log("Ejecución Finalizada");
	}
}
