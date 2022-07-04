import { faker } from "@faker-js/faker";

const baseUrl: string = Cypress.config().baseUrl;

describe("Login", () => {
  beforeEach(() => {
    cy.server();
    cy.visit("login");
  });

  it("Should load with correct inital state", () => {
    cy.getByTestId("email").should("have.attr", "readOnly");
    cy.getByTestId("email-status").should("have.attr", "title", "Campo obrigatório");

    cy.getByTestId("password").should("have.attr", "readOnly");
    cy.getByTestId("password-status").should("have.attr", "title", "Campo obrigatório");
    
    cy.getByTestId("submit-button").should("have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present error state if form is invalid", () => {
    cy.getByTestId("email").focus().type(faker.random.word());
    cy.getByTestId("email-status").should("have.attr", "title", "O campo email está invalido");
    cy.getByTestId("password").focus().type(faker.random.alphaNumeric(4));
    cy.getByTestId("password-status").should("have.attr", "title", "O campo password está invalido");
    cy.getByTestId("submit-button").should("have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present valid state if form is valid", () => {
    cy.getByTestId("email").focus().type(faker.internet.email());
    cy.getByTestId("email-status").should("have.attr", "title", "Tudo certo!");
    cy.getByTestId("password").focus().type(faker.random.alphaNumeric(5));
    cy.getByTestId("password-status").should("have.attr", "title", "Tudo certo!");
    cy.getByTestId("submit-button").should("not.have.attr", "disabled");
    cy.getByTestId("error-wrap").should("not.have.descendants");
  });

  it("Should present InvalidCredentialsError on 401", () => {
    cy.route({
      method: "POST",
      url: /login/,
      status: 401,
      response: {
        error: faker.random.words(),
      },
    });
    cy.getByTestId("email").focus().type(faker.internet.email());
    cy.getByTestId("password").focus().type(faker.random.alphaNumeric(5));
    cy.getByTestId("submit-button").click();
    cy.getByTestId("spinner").should("not.exist")
      .getByTestId("main-error").should("contain.text", "Credenciais inválidas");
    cy.url().should("eq", `${baseUrl}/login`);
  });

  it("Should present UnexpectedError on 400", () => {
    cy.route({
      method: "POST",
      url: /login/,
      status: 400,
      response: {
        error: faker.random.words(),
      },
    });
    cy.getByTestId("email").focus().type(faker.internet.email());
    cy.getByTestId("password").focus().type(faker.random.alphaNumeric(5));
    cy.getByTestId("submit-button").click();
    cy.getByTestId("spinner").should("not.exist")
      .getByTestId("main-error").should("contain.text", "Erro inesperado. Tente novamente em instantes");
    cy.url().should("eq", `${baseUrl}/login`);
  });

  it("Should present UnexpectedError if invalid data is returned", () => {
    cy.route({
      method: "POST",
      url: /login/,
      status: 200,
      response: {
        invalidProperty: faker.datatype.uuid(),
      },
    });
    cy.getByTestId("email").focus().type("mango@gmail.com");
    cy.getByTestId("password").focus().type("12345");
    cy.getByTestId("submit-button").click();
    cy.getByTestId("spinner").should("not.exist")
    cy.getByTestId("main-error").should("contain.text", "Erro inesperado. Tente novamente em instantes")
    cy.url().should("eq", `${baseUrl}/login`);
  });

  it("Should save accessToken if valid credentials are provided", () => {
    cy.route({
      method: "POST",
      url: /login/,
      status: 200,
      response: {
        accessToken: faker.datatype.uuid(),
      },
    });
    cy.getByTestId("email").focus().type("mango@gmail.com");
    cy.getByTestId("password").focus().type("12345");
    cy.getByTestId("submit-button").click();
    cy.getByTestId("spinner").should("not.exist")
    cy.getByTestId("main-error").should("not.exist")
    cy.url().should("eq", `${baseUrl}/`);
    cy.window().then((window) => assert.isOk(window.localStorage.getItem("accessToken")));
  });
});