import { requestLogin, seedBackend } from "./utils.cy";
import { seededProject1 } from "../fixtures/variables";

describe("Home page", () => {
  beforeEach(() => {
    seedBackend();
  });

  it("should show a list of projects", () => {
    requestLogin();
    cy.visit("/");
    cy.contains(seededProject1.name);
  });
});
