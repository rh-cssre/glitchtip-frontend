import { seedBackend, requestLogin, getDSN } from "./utils.cy";
import * as jsErrors from "../fixtures/events";
import * as djangoErrors from "../fixtures/django-events";
import { organization, project2, project3 } from "../fixtures/variables";

function seedJavaScriptIssues(dsn: string) {
  const url = getDSN(dsn);
  cy.request("POST", url, jsErrors.evalError);
  cy.wait(1000);
  cy.request("POST", url, jsErrors.autoplayError);
  cy.wait(1000);
  cy.request("POST", url, jsErrors.jsRangeError);
  cy.wait(1000);
  cy.request("POST", url, jsErrors.debugMessage);
  cy.wait(1000);
  cy.request("POST", url, jsErrors.jsReferenceError);
  cy.wait(1000);
  jsErrors.generateErrors(url, 10);
  cy.wait(1000);
  cy.request("POST", url, jsErrors.infoMessage);
  cy.wait(1000);
  cy.request("POST", url, jsErrors.criticalMessage);
  cy.wait(1000);
  cy.request("POST", url, jsErrors.jsSyntaxError);
  cy.wait(1000);
  cy.request("POST", url, jsErrors.jsUriError);
  cy.wait(1000);
}

function seedDjangoIssues(dsn: string) {
  const url = getDSN(dsn);
  cy.request("POST", url, djangoErrors.noReverseMatch);
  cy.wait(1000);
  cy.request("POST", url, djangoErrors.logging);
}

describe("Screenshot Run", () => {
  if (Cypress.env("screenshot")) {
    beforeEach(() => {
      seedBackend(true);
      requestLogin();
      cy.visit(`/${organization.slug}/issues`);
      cy.get("gt-project-filter-bar mat-expansion-panel-header").click();
      cy.get("gt-project-filter-bar").contains(project3.name).click();
      // Need the DSN to do this from the frontend
      cy.get("[data-test-dsn]")
        .invoke("val")
        .then((dsn) => seedJavaScriptIssues(dsn as string));

      cy.get("gt-project-filter-bar mat-expansion-panel-header").click();
      cy.get("gt-project-filter-bar").contains(project2.name).click();
      // Need the DSN to do this from the frontend
      cy.get("[data-test-dsn]")
        .invoke("val")
        .then((dsn) => seedDjangoIssues(dsn as string));
    });

    it("should show issues, recognize environments", () => {
      cy.wait(5000);

      cy.visit(`/${organization.slug}/issues`);

      cy.wait(1000);

      // cy.viewport(1285, 800);
      cy.viewport(2570, 1600);
      cy.screenshot("issues-page");

      cy.get(".title-cell").find("a").contains("<unknown>").click();
      cy.wait(1000);
      cy.screenshot("issue-detail");
    });
  }
});
