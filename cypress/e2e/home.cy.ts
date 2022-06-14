import { requestLogin, seedBackend } from "./utils.cy";
import { project } from "../fixtures/variables";

describe("Home page", () => {
  beforeEach(() => {
    seedBackend();
  });

  it("should show a list of projects", () => {
    requestLogin();
    cy.visit("/");
    cy.contains(project.name);
  });
});
