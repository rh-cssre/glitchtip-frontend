import { seedBackend, requestLogin } from "./utils.cy";
import { environment } from "../../src/environments/environment";

if (environment.loginForm) {
describe("Change Password", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
    cy.visit("/profile");
  });

  it("should show one primary email address", () => {
    cy.get("gt-manage-emails").contains("cypresstest@example.com");
  });

  it("should manipulate the email list and do some validation", () => {
    const secondEmail = "cypresssecondemail@example.com";

    // Add email
    cy.get("input[formcontrolname=email_address]").type(secondEmail);
    cy.get("#add-email-form").submit();
    cy.get("gt-manage-emails mat-list").contains(secondEmail);

    // Duplicate email
    cy.get("input[formcontrolname=email_address]").type(secondEmail);
    cy.get("#add-email-form").submit();
    cy.get("gt-manage-emails").contains("is already on the list");

    // Email is not valid because mailgun says so. Comment out if problematic
    // const invalidEmail = "hello@a.aa";
    // cy.get("input[formcontrolname=email_address]").clear().type(invalidEmail);
    // cy.get("#add-email-form").submit();
    // cy.get("gt-manage-emails").contains("This is not a valid email address");

    // Email is associated with another account
    const emailForOtherAccount = "cypresstest-other@example.com";
    cy.get("input[formcontrolname=email_address]")
      .clear()
      .type(emailForOtherAccount);
    cy.get("#add-email-form").submit();
    cy.get("gt-manage-emails").contains("is already associated with another");

    // Delete email
    const emailToDelete = "cypress-email-to-delete@example.com";
    cy.get("input[formcontrolname=email_address]").clear().type(emailToDelete);
    cy.get("#add-email-form").submit();
    cy.get("mat-list-item:nth-child(3) .delete-button").click({ force: true });
    cy.get("gt-manage-emails").should("not.contain", emailToDelete);

    // TODO Make primary
    // TODO Resend verification
    // TODO Verify? Might not be possible or even necessary
  });
});
}
