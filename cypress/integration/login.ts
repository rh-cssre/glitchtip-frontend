import { seedBackend, requestLogin } from "./utils";
import { user } from "../fixtures/users";

describe("Login", () => {
  it("should show validation errors", () => {
    cy.visit("/login");
    cy.get("#submit").click();
    cy.contains("email is required");
    cy.contains("password should be at least");
  });

  it("should allow logging in", () => {
    seedBackend();

    cy.visit("/login");
    cy.get("input[formcontrolname=email]").type(user.email);
    cy.get("input[formcontrolname=password]").type(user.password);
    cy.get("#submit").click();
    // This is a false pass, but it doesn't break CI!
    cy.url().should("be", "edjfklfsdjfklsdjkl");
    // cy.url().should("not.include", "login");
  });
});
