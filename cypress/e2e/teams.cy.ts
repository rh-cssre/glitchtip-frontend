import { seedBackend, requestLogin } from "./utils.cy";
import { organization, newTeam, team } from "../fixtures/variables";
import { user } from "../fixtures/users";

describe("Create New Team", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
  });

  it("should add and update teams", () => {
    cy.visit(`/${organization.slug}/settings/teams`);
    cy.get("#new-team").click();
    cy.get("input[formcontrolname=slug]").type(newTeam.slug);
    cy.get("#create-team-submit").click();
    cy.contains(`#${newTeam.slug}`);
  });

  it("should show validation errors", () => {
    cy.visit(`/${organization.slug}/settings/teams`);
    cy.get("#new-team").click();
    cy.get("input[formcontrolname=slug]").type(
      newTeam.slug + " invalid ch@r@cter$"
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
    cy.visit(`/${organization.slug}/settings/teams/${team.name}/members/`);
    cy.contains(`#${team.name}`);
    cy.get("[data-cy=team-member-select]")
      .click()
      .get("mat-select")
      .get("mat-option")
      .contains(user.email)
      .click();
    cy.get("[data-test-list] li").first().contains(user.email);
  });

  it("should remove a team member", () => {
    cy.visit(`/${organization.slug}/settings/teams/${team.name}/members/`);
    cy.get("[data-cy=team-member-select]")
      .click()
      .get("mat-select")
      .get("mat-option")
      .contains(user.email)
      .click();
    cy.get("#remove-team-member").click();
    cy.contains("This team doesn't have any members");
  });
});
