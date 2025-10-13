import { requestLogin, seedBackend } from "./utils.cy";
import { organization } from "../fixtures/variables";

describe("Organization Settings", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
  });

  it("updates the org name, deletes org and returns to empty org state", () => {
    cy.visit(`/${organization.slug}/settings`);
    cy.contains(organization.name);
    cy.get("input[formcontrolname=name]").clear().type(organization.otherOrg);
    cy.get("#update-org").click();
    cy.get("input[formcontrolname=name]").should('have.value', organization.otherOrg);
    // clear db
    cy.get("#delete-org").click();
    cy.get("[data-cy='dialog-confirm']").click()
    cy.contains("successfully deleted");
    cy.url().should("eq", "http://localhost:4200/");
    cy.contains("In order to use GlitchTip, you'll need to create an");
  });

  // Commented out because the test logs you out on the pipeline
  // it("deleting one of multiple orgs sets new active org", () => {
  // create org
  // cy.visit("/organizations/new");
  // cy.get("input[formControlname=name").type("another-org");
  // cy.get("#submit").click();
  // cy.visit("/settings/another-org");
  // cy.get("#delete-org").click();
  // cy.url().should("eq", "http://localhost:4200/");
  // cy.contains(organization.slug);
  // cy.contains(project.name);
  // });
});
