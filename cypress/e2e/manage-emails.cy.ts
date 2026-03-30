import { seedBackend, requestLogin } from "./utils.cy";
import { seededUser1, seededUser2 } from "../fixtures/users";

describe("Change Password", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
    cy.visit("/profile");
  });

  it("should show one primary email address", () => {
    cy.get("gt-manage-emails").contains(seededUser1.email);
  });

  it("should manipulate the email list and do some validation", () => {
    const secondEmail = "cypresssecondemail@example.com";

    // Add email
    cy.get("input[formcontrolname=email_address]").type(secondEmail);
    cy.get("#add-email-form").submit();
    cy.get("gt-manage-emails ul").contains(secondEmail);

    // Duplicate email
    cy.get("input[formcontrolname=email_address]").type(secondEmail);
    cy.get("#add-email-form").submit();
    cy.get("gt-manage-emails").contains("is already on the list");

    // Email is associated with another account
    cy.get("input[formcontrolname=email_address]")
      .clear()
      .type(seededUser2.email);
    cy.get("#add-email-form").submit();
    cy.get("gt-manage-emails").contains("already exists");

    // Delete email
    const emailToDelete = "cypress-email-to-delete@example.com";
    cy.get("input[formcontrolname=email_address]").clear().type(emailToDelete);
    cy.get("#add-email-form").submit();
    cy.get("li:nth-child(3) [data-cy=delete-button]").click({ force: true });
    cy.get("gt-manage-emails").should("not.contain", emailToDelete);

    // TODO Make primary
    // TODO Resend verification
    // TODO Verify? Might not be possible or even necessary
  });
});
