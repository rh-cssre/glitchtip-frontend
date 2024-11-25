describe("Send reset email", () => {
  it("should show validation errors", () => {
    cy.visit("/reset-password");
    cy.get("#submit").click();
    cy.contains("Enter a valid email address");
  });

  it("should show success state", () => {
    cy.visit("/reset-password");
    cy.get("input[formcontrolname=email]").type("aa@aa.com");
    cy.get("#submit").click();
    cy.get("[data-cy=reset-success]")
  });
});
