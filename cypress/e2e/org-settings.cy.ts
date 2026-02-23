import { requestLogin, seedBackend } from "./utils.cy";
import { seededOrg } from "../fixtures/variables";

describe("Organization Settings", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
  });

  it("updates the org name, deletes org and returns to empty org state", () => {
    const newOrgName = "e2etestobj-other-org"
    cy.visit(`/${seededOrg.slug}/settings`);
    cy.contains(seededOrg.name);
    cy.get("input[formcontrolname=name]").clear().type(newOrgName);
    cy.get("#update-org").click();
    cy.get("input[formcontrolname=name]").should(
      "have.value",
      newOrgName,
    );
    // clear db
    cy.get("#delete-org").click();
    cy.get("[data-cy='dialog-confirm']").click();
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
