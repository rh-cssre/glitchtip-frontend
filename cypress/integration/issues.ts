import { seedBackend, requestLogin } from "./utils";
import * as jsErrors from "../fixtures/events";
import { organization, environments } from "../fixtures/variables";

function seedIssues(dsn: string) {
  const key = dsn.split("@")[0].split("//")[1];
  const id = dsn.split("@")[1].split("/")[1];
  const url = `/api/${id}/store/?sentry_key=${key}&sentry_version=7`;
  cy.request("POST", url, jsErrors.jsRangeError);
  cy.request("POST", url, jsErrors.jsReferenceError);
  jsErrors.generateUniqueErrors(url, 5);
  cy.request("POST", url, jsErrors.jsSyntaxError);
  cy.request("POST", url, jsErrors.jsUriError);
}

describe("Issues Page", () => {
  beforeEach(() => {
    seedBackend(true);
    requestLogin();
    cy.visit("/cypresstestorg/issues");
    // Need the DSN to do this from the frontend
    cy.get("[data-test-dsn]")
      .invoke("val")
      .then((dsn) => seedIssues(dsn as string));
  });

  it("should show issues, recognize environments", () => {
    cy.visit("/cypresstestorg/issues");

    // We seeded 5 issues, they should all be showing
    cy.get("table tbody").find("tr").should("have.length", 5);

    // Test sorts
    // Last seen
    cy.get("table tbody").find("tr").first().contains("URIError");
    // First seen
    cy.get('mat-select[formControlName="sort"]').click();
    cy.get(".cdk-overlay-pane")
      .find("mat-option")
      .contains("First Seen")
      .click();
    cy.get("table tbody").find("tr").first().contains("RangeError");
    // Most Frequent
    cy.get('mat-select[formControlName="sort"]').click();
    cy.get(".cdk-overlay-pane")
      .find("mat-option")
      .contains("Most Frequent")
      .click();
    cy.get("table tbody").find("tr").first().contains("<unknown>");
    // Least Frequent
    cy.get('mat-select[formControlName="sort"]').click();
    cy.get(".cdk-overlay-pane")
      .find("mat-option")
      .contains("Least Frequent")
      .click();
    cy.get("table tbody").find("tr").last().contains("<unknown>");

    // Open environments dropdown, make sure it contains the environments
    cy.get('mat-select[formControlName="environment"]').click();
    cy.get(".cdk-overlay-pane")
      .find("mat-option")
      .contains(environments.production);
    cy.get(".cdk-overlay-pane")
      .find("mat-option")
      .contains(environments.staging);

    // Filter by environment, make sure the right stuff shows
    cy.get(".cdk-overlay-pane")
      .find("mat-option")
      .contains(environments.development)
      .click();
    cy.get("table tbody").find("tr").should("have.length", 1);
    cy.get("table tbody").find("tr").should("not.contain", "SyntaxError");
    cy.get("table tbody").find("tr").should("contain", "ReferenceError");

    // Visiting a URL with environment should filter and set the environment dropdown
    cy.visit(
      `${organization.name}/issues?environment=${environments.production}`
    );
    cy.get("table tbody").find("tr").should("contain", "RangeError");
  });
});
