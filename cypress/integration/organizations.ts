import { seedBackend, requestLogin } from "./utils";
import { organization } from "../fixtures/variables";

describe("Organizations", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
  });

  it("should create an org and more", () => {
    const secondOrg = "cypress second org";
    cy.visit(`/`);
    cy.get("#org-dropdown").click();
    cy.get("#create-new-link").click();
    cy.get("#create-organization-form input").type(secondOrg);
    cy.get("#create-organization-form").submit();
    // cy.get(".mat-list-item-content").contains(secondOrg);

    // glitchtip-frontend#55: org slug in URL should always match active org.
    // It got out of sync with a back button.

    // cy.visit(`/settings/${organization.slug}/`);
    // cy.get("#org-dropdown").click();
    // cy.get(".mat-menu-content button:nth-child(1)").click();
    // cy.go("back");
    // cy.get("#org-dropdown span").contains(organization.slug);
  });

  it("should delete an org", () => {
    const doomedOrg = "cypress doomed org";
    cy.visit(`/organizations/new`);
    cy.get("#create-organization-form input").type(doomedOrg);
    cy.get("#create-organization-form").submit();
    cy.get("[data-test-settings]").click();
    // cy.get("[data-test] button").click();
    // cy.get(".cdk-overlay-container").contains(
    //   `You have successfully deleted ${doomedOrg}`
    // );
  });
});
