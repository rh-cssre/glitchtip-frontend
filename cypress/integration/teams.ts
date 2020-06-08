import { seedBackend, requestLogin } from "./utils";
import { organization } from "../fixtures/organizations";

describe("Create New Team", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
  });

  it("should add and update teams", () => {
    cy.visit(`/settings/${organization.name}/teams`);
    cy.get("#new-team").click();
    cy.get("input[formcontrolname=slug]").type("coffeeconnoisseurs");
    cy.get("#create-team-submit").click();
    cy.contains("#coffeeconnoisseurs");
  });

  it("should show validation errors", () => {
    cy.visit(`/settings/${organization.name}/teams`);
    cy.get("#new-team").click();
    cy.get("input[formcontrolname=slug]").type("coffee connoisseurs");
    cy.get("#create-team-submit").click();
    cy.contains("consisting of letters, numbers, underscores or hyphens.");
  });
});
