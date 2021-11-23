import { Container } from "inversify";
import { AuthorizerController } from "../controller/AuthorizerController";
import { TYPES } from "../utils/Constants";
import { AuthorizerCLIController } from "../controller/cli/AuthorizerCLIController";
import { IAuthorizerService } from "../service/IAuthorizerService";
import { AuthorizerService } from "../service/AuthorizerService";
import { AccountRepository } from "../repository/AccountRepository";
import { AccountInMemoryRepository } from "../repository/in-memory/AccountInMemoryRepository";
import { AuthorizerPresenter } from "../presenter/AuthorizerPresenter";
import { AuthorizerSimplePresenter } from "../presenter/simple/AuthorizerSimplePresenter";
import { DateProvider } from "../provider/DateProvider";
import { LuxonDateProvider } from "../provider/luxon/LuxonDateProvider";

const AppContainer: Container = new Container();

AppContainer.bind<AuthorizerController>(TYPES.AuthorizerController).to(AuthorizerCLIController);
AppContainer.bind<IAuthorizerService>(TYPES.AuthorizerService).to(AuthorizerService);
AppContainer.bind<AccountRepository>(TYPES.AccountRepository).to(AccountInMemoryRepository);
AppContainer.bind<AuthorizerPresenter>(TYPES.AuthorizerPresenter).to(AuthorizerSimplePresenter);
AppContainer.bind<DateProvider>(TYPES.DateProvider).to(LuxonDateProvider);

export { AppContainer };
