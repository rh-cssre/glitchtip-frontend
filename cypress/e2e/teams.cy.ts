import { seedBackend, requestLogin } from "./utils.cy";
import { seededOrg, secondSeededTeam, seededTeam } from "../fixtures/variables";
import { seededUser1 } from "../fixtures/users";

describe("Create New Team", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
  });

  it("should add and update teams", () => {
    cy.visit(`/${seededOrg.slug}/settings/teams`);
    cy.get("#new-team").click();
    cy.get("input[formcontrolname=slug]").type(secondSeededTeam.slug);
    cy.get("#create-team-submit").click();
    cy.contains(`#${secondSeededTeam.slug}`);
  });

  it("should show validation errors", () => {
    cy.visit(`/${seededOrg.slug}/settings/teams`);
    cy.get("#new-team").click();
    cy.get("input[formcontrolname=slug]").type(
      secondSeededTeam.slug + " invalid ch@r@cter$",
    );
    cy.get("#create-team-submit").click();
    cy.contains("Use only letters, numbers, underscores");
  });
});

describe("List Team Members", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
  });

  it("should add and list team member", () => {
    cy.visit(`/${seededOrg.slug}/settings/teams/${seededTeam.name}/members/`);
    cy.contains(`#${seededTeam.name}`);
    cy.get("[data-cy=team-member-select]")
      .click()
      .get("mat-select")
      .get("mat-option")
      .contains(seededUser1.email)
      .click();
    cy.get("[data-test-list] li").first().contains(seededUser1.email);
  });

  it("should remove a team member", () => {
    cy.visit(`/${seededOrg.slug}/settings/teams/${seededTeam.name}/members/`);
    cy.get("[data-cy=team-member-select]")
      .click()
      .get("mat-select")
      .get("mat-option")
      .contains(seededUser1.email)
      .click();
    cy.get("#remove-team-member").click();
    cy.contains("This team doesn't have any members");
  });
});
