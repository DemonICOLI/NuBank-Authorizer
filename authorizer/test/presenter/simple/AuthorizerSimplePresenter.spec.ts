import { AuthorizerSimplePresenter } from "../../../src/presenter/simple/AuthorizerSimplePresenter";

describe("AccountInMemoryRepository Test Suite", () => {
	it("generateResponse should return and account and its violations", () => {
		const presenter = new AuthorizerSimplePresenter();
		let response = presenter.generateResponse({}, []);
		expect(response).toEqual(jasmine.objectContaining({ account: {}, violations: [] }));
	});
});
