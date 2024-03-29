import * as MockFormHelper from "../utils/form-helpers";
import * as MockHelper from "../utils/helpers";
import * as MockHttpHelper from "../utils/http-mocks";
import { faker } from "@faker-js/faker";

const path = /login/

const mockInvalidCredentialsError = (): void => {
  MockHttpHelper.mockUnauthorizedError(path);
};

const mockUnexpectedError = (): void => {
  MockHttpHelper.mockServerError(path, "POST");
};

const mockSuccess = (): void => {
  MockHttpHelper.mockOk(path, "POST", "fx:account");
};

const populateFields = (): void => {
  cy.getByTestId("email").focus().type(faker.internet.email());
  cy.getByTestId("password").focus().type(faker.random.alphaNumeric(5));
};

const simulateValidSubmit = (): void => {
  populateFields();
  cy.getByTestId("submit-button").click();
};

describe("Login", () => {
  beforeEach(() => {
    cy.visit("login");
  });

  it("Should load with correct inital state", () => {
    cy.getByTestId("email").should("have.attr", "readOnly");
    MockFormHelper.testInputStatus("email", "Campo obrigatório");

    cy.getByTestId("password").should("have.attr", "readOnly");
    MockFormHelper.testInputStatus("password", "Campo obrigatório");

    cy.getByTestId("submit-button").should("have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present error state if form is invalid", () => {
    cy.getByTestId("email").focus().type(faker.random.word());
    MockFormHelper.testInputStatus("email", "O campo email está invalido");

    cy.getByTestId("password").focus().type(faker.random.alphaNumeric(4));
    MockFormHelper.testInputStatus("password", "O campo password está invalido");

    cy.getByTestId("submit-button").should("have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present valid state if form is valid", () => {
    cy.getByTestId("email").focus().type(faker.internet.email());
    MockFormHelper.testInputStatus("email");

    cy.getByTestId("password").focus().type(faker.random.alphaNumeric(5));
    MockFormHelper.testInputStatus("password");

    cy.getByTestId("submit-button").should("not.have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present InvalidCredentialsError on 401", () => {
    mockInvalidCredentialsError();
    simulateValidSubmit();
    MockFormHelper.testMainError("Credenciais inválidas");
    MockHelper.testUrl("/login");
  });

  it("Should present UnexpectedError on default error cases", () => {
    mockUnexpectedError();
    simulateValidSubmit();
    MockFormHelper.testMainError("Erro inesperado. Tente novamente em instantes");
    MockHelper.testUrl("/login");
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

  it("Should save account if valid credentials are provided", () => {
    mockSuccess();
    simulateValidSubmit();
    cy.getByTestId("spinner").should("not.exist");
    cy.getByTestId("main-error").should("not.exist");
    MockHelper.testUrl("/");
    MockHelper.testLocalStorageItem("account");
  });
});
