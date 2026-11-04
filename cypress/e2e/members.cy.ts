import { requestLogin, seedBackend } from "./utils.cy";
import { seededOrg } from "../fixtures/variables";
import { seededUser2 } from "../fixtures/users";

describe("Organization Members", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
  });

  // The list is cached app-wide, so a stale copy shows unless changes reload it.
  it("shows an invite and a role change without a page refresh", () => {
    cy.visit(`/${seededOrg.slug}/settings/members`);
    cy.contains("a", seededUser2.email).should("not.exist");

    cy.contains("a", "Invite Member").click();
    cy.get("input[formcontrolname=email]").type(seededUser2.email);
    cy.contains("button", "Add Member(s)").click();

    cy.url().should("match", /\/settings\/members$/);
    cy.contains("gt-list-row", seededUser2.email)
      .should("contain", "Invite pending")
      .and("contain", "Member");

    cy.contains("a", seededUser2.email).click();
    cy.contains("mat-radio-button", "Admin").click();
    cy.contains("button", "Save role").click();
    cy.contains("role to Admin");

    cy.contains("a", "Members").click();
    cy.contains("gt-list-row", seededUser2.email).should("contain", "Admin");
  });
});
