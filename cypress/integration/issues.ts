import { seedBackend, requestLogin } from "./utils";
import * as jsErrors from "../fixtures/events";

function seedIssues(dsn: string) {
  // http://d85d8c23767f4352abf0afffc69e4b89@localhost:8000/82
  const key = dsn.split("@")[0].split("//")[1];
  const id = dsn.split("@")[1].split("/")[1];
  const url = `/api/${id}/store/?sentry_key=${key}&sentry_version=7`;
  cy.request("POST", url, jsErrors.jsRangeError);
  cy.request("POST", url, jsErrors.jsReferenceError);
  cy.request("POST", url, jsErrors.jsSyntaxError);
  cy.request("POST", url, jsErrors.jsUriError);
}

describe("Issues Page", () => {
  beforeEach(() => {
    seedBackend(true);
    requestLogin();
    cy.visit("/cypresstestorg/issues");
  });

  it("should say 'Issues'", () => {
    cy.contains("Issues");
    cy.get("[data-test-dsn]")
      .invoke("val")
      .then((dsn) => {
        seedIssues(dsn as string);
      });
    cy.wait(1000);
    cy.reload();
    cy.get("table tbody").find("tr").should("have.length", 4);
    cy.get('mat-select[formControlName="environment"]').click();
    cy.get(".cdk-overlay-pane").find("mat-option").contains("production");
    cy.get(".cdk-overlay-pane").find("mat-option").contains("staging");
    cy.get(".cdk-overlay-pane")
      .find("mat-option")
      .contains("development")
      .click();
    cy.get("table tbody").find("tr").should("have.length", 1);
    cy.get("table tbody").find("tr").should("not.contain", "SyntaxError");
    cy.get("table tbody").find("tr").should("contain", "ReferenceError");
  });
});
