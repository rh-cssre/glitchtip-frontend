import { requestLogin, seedBackend } from "./utils";

describe("Home page", () => {
  beforeEach(() => {
    seedBackend();
  });

  it("should show zero projects info on home page", () => {
    requestLogin();
    cy.visit("/");
    cy.contains("This organization has no projects");
  });
});
