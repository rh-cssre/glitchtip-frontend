import { seedBackend, requestLogin } from "./utils.cy";
import { changePassword, user } from "../fixtures/users";

describe("Change Password", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
    cy.visit("/profile");
  });

  it("should show validation errors", () => {
    cy.get("input[formcontrolname=old_password]").type(
      changePassword.incorrect_password
    );
    cy.get("input[formcontrolname=new_password1]").type(
      changePassword.new_password1
    );
    cy.get("input[formcontrolname=new_password2]").type(
      changePassword.new_password2
    );
    cy.get("#change-password-form").submit();
    cy.contains("Your current password is incorrect.");
  });

  it("Should confirm the user's password was saved", () => {
    cy.get("input[formcontrolname=old_password]").type(user.password);
    cy.get("input[formcontrolname=new_password1]").type(
      changePassword.new_password1
    );
    cy.get("input[formcontrolname=new_password2]").type(
      changePassword.new_password2
    );
    cy.get("#change-password-form").submit();
    cy.contains("Your new password has been saved");
  });
});
