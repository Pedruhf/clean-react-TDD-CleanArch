import * as MockFormHelper from "../utils/form-helpers";
import * as MockHelper from "../utils/helpers";
import * as MockHttpHelper from "../utils/http-mocks";
import { faker } from "@faker-js/faker";

const path = /signup/;

const mockEmailInUseError = (): void => {
  MockHttpHelper.mockForbiddenError(path, "POST");
};

const mockUnexpectedError = (): void => {
  MockHttpHelper.mockServerError(path, "POST");
};

const mockSuccess = (): void => {
  MockHttpHelper.mockOk(path, "POST", "fx:account");
};

const populateFields = (): void => {
  cy.getByTestId("name").focus().type(faker.name.findName());
  cy.getByTestId("email").focus().type(faker.internet.email());
  const password = faker.random.alphaNumeric(5);
  cy.getByTestId("password").focus().type(password);
  cy.getByTestId("passwordConfirmation").focus().type(password);
};

const simulateValidSubmit = (): void => {
  populateFields();
  cy.getByTestId("submit-button").click();
};

describe("SignUp", () => {
  beforeEach(() => {
    cy.visit("signup");
  });

  it("Should load with correct inital state", () => {
    cy.getByTestId("name").should("have.attr", "readOnly");
    MockFormHelper.testInputStatus("name", "Campo obrigatório");

    cy.getByTestId("email").should("have.attr", "readOnly");
    MockFormHelper.testInputStatus("email", "Campo obrigatório");

    cy.getByTestId("password").should("have.attr", "readOnly");
    MockFormHelper.testInputStatus("password", "Campo obrigatório");

    cy.getByTestId("passwordConfirmation").should("have.attr", "readOnly");
    MockFormHelper.testInputStatus("passwordConfirmation", "Campo obrigatório");

    cy.getByTestId("submit-button").should("have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present error state if form is invalid", () => {
    cy.getByTestId("name").focus().type(faker.random.alphaNumeric(2));
    MockFormHelper.testInputStatus("name", "O campo name está invalido");

    cy.getByTestId("email").focus().type(faker.random.word());
    MockFormHelper.testInputStatus("email", "O campo email está invalido");

    cy.getByTestId("password").focus().type(faker.random.alphaNumeric(4));
    MockFormHelper.testInputStatus("password", "O campo password está invalido");

    cy.getByTestId("passwordConfirmation").focus().type(faker.random.alphaNumeric(4));
    MockFormHelper.testInputStatus("passwordConfirmation", "O campo passwordConfirmation está invalido");

    cy.getByTestId("submit-button").should("have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present valid state if form is valid", () => {
    cy.getByTestId("name").focus().type(faker.name.findName());
    MockFormHelper.testInputStatus("name");

    cy.getByTestId("email").focus().type(faker.internet.email());
    MockFormHelper.testInputStatus("email");

    const password = faker.random.alphaNumeric(5);
    cy.getByTestId("password").focus().type(password);
    MockFormHelper.testInputStatus("password");

    cy.getByTestId("passwordConfirmation").focus().type(password);
    MockFormHelper.testInputStatus("passwordConfirmation");

    cy.getByTestId("submit-button").should("not.have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present EmailInUseError on 403", () => {
    mockEmailInUseError();
    simulateValidSubmit();
    MockFormHelper.testMainError("Este e-mail já está sendo utilizado");
    MockHelper.testUrl("/signup");
  });

  it("Should present UnexpectedError on default error cases", () => {
    mockUnexpectedError();
    simulateValidSubmit();
    MockFormHelper.testMainError("Erro inesperado. Tente novamente em instantes");
    MockHelper.testUrl("/signup");
  });

  it("Should save account if valid credentials are provided", () => {
    mockSuccess();
    simulateValidSubmit();
    cy.getByTestId("spinner").should("not.exist");
    cy.getByTestId("main-error").should("not.exist");
    MockHelper.testUrl("/");
    MockHelper.testLocalStorageItem("account");
  });

  it("Should prevent multiple submits", () => {
    mockSuccess();
    populateFields();
    cy.getByTestId("submit-button").dblclick();
    MockHelper.testHttpCallsCount(1);
  });

  it("Should not call submits if form is invalid", () => {
    mockSuccess();
    cy.getByTestId("email").focus().type(faker.internet.email()).type("{enter}");
    MockHelper.testHttpCallsCount(0);
  });
});
