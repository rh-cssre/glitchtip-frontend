import { seedBackend, requestLogin } from "./utils.cy";
import { seededOrg } from "../fixtures/variables";

describe("Organizations", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
  });

  it("should create an org and more", () => {
    const newOrg = "e2etestobj-second-org";
    cy.visit(`/`);
    cy.get("[data-cy=orgSelect]").click();
    cy.get("[data-cy=createNewLink]").click();
    cy.url().should("eq", "http://localhost:4200/organizations/new");
    cy.get("[data-cy=create-organization-input]").type(newOrg);
    cy.get("[data-cy=create-organization-form]").submit();
    cy.get("[data-cy=orgSelect]").contains(newOrg);

    // Ensure url and displayed org in select component are in sync
    cy.visit(`/${seededOrg.slug}/settings`);
    cy.get("[data-cy=orgSelect]").contains(seededOrg.name).click();
    cy.get("mat-option").contains(newOrg).click();
    cy.url().should("eq", `http://localhost:4200/${newOrg}/settings`);
    cy.get("[data-cy=orgSelect]").should("contain", newOrg);
  });
});
