import { seedBackend, requestLogin, getDSN } from "./utils.cy";
import * as jsErrors from "../fixtures/events";
import { organization, environments } from "../fixtures/variables";

function seedIssues(dsn: string) {
  const url = getDSN(dsn);
  cy.request("POST", url, jsErrors.jsRangeError);
  cy.request("POST", url, jsErrors.jsReferenceError);
  jsErrors.generateErrors(url, 10);
  cy.request("POST", url, jsErrors.jsSyntaxError);
  cy.request("POST", url, jsErrors.jsUriError);
}

describe("Issues Page", () => {
  beforeEach(() => {
    seedBackend(true);
    requestLogin();
    cy.visit(`/${organization.slug}/issues`);
    // Need the DSN to do this from the frontend
    cy.get("gt-project-filter-bar mat-expansion-panel-header").click();
    cy.get("gt-project-filter-bar").contains("PitchFlip").click();
    cy.get("[data-test-dsn]").invoke("val").as("dsn");
  });

  // // TODO: Break up these assertions into smaller tests.
  // it("should show issues, recognize environments", function () {
  //   seedIssues(this.dsn);
  //   cy.visit(`/${organization.slug}/issues`);

  //   const issuesSeeded = 5;
  //   cy.get("table tbody")
  //     .find("tr")
  //     .should("have.length", issuesSeeded)
  //     .log(`Should be showing all ${issuesSeeded} issues`);

  //   // Test sorts
  //   cy.get("table tbody")
  //     .find("tr")
  //     .first()
  //     .contains("URIError")
  //     .log("Should show 'Last Seen' issue by default");

  //   cy.get('mat-select[formControlName="sort"]').click();
  //   cy.get(".cdk-overlay-pane mat-option").contains("First Seen").click();
  //   cy.get("table tbody tr")
  //     .first()
  //     .contains("RangeError")
  //     .log("Should now be sorted by 'First Seen'");

  //   cy.get('mat-select[formControlName="sort"]').click();
  //   cy.get(".cdk-overlay-pane mat-option").contains("Most Frequent").click();
  //   cy.get("table tbody")
  //     .find("tr")
  //     .first()
  //     .contains("<unknown>")
  //     .log("Should now be sorted by 'Most Frequent'");

  //   cy.get('mat-select[formControlName="sort"]').click();
  //   cy.get(".cdk-overlay-pane mat-option").contains("Least Frequent").click();
  //   cy.get("table tbody")
  //     .find("tr")
  //     .last()
  //     .contains("<unknown>")
  //     .log("Should now be sorted by 'Least Frequent'");

  //   // Test environments
  //   cy.get('mat-select[formControlName="environment"]').click({ force: true });
  //   cy.get(".cdk-overlay-pane mat-option")
  //     .contains(environments.production)
  //     .log(
  //       "Envrionments dropdown should contain environments from generated issues"
  //     );
  //   cy.get(".cdk-overlay-pane mat-option").contains(environments.staging);

  //   cy.get(".cdk-overlay-pane mat-option")
  //     .contains(environments.development)
  //     .click()
  //     .log("Test environment filtering by clicking the dropdown");
  //   cy.get("table tbody tr")
  //     .should("have.length", 1)
  //     .should("not.contain", "SyntaxError")
  //     .should("contain", "ReferenceError")
  //     .log("Environments should properly filter issue list");

  //   const environmentUrl = `${organization.slug}/issues?environment=${environments.production}`;
  //   cy.visit(environmentUrl).log(
  //     "Test enviornment filtering by visiting a URL with environment queryParam"
  //   );
  //   // There was a problem with an observable where the param would get stripped on page load
  //   cy.url()
  //     .should("eq", `${Cypress.config().baseUrl}/${environmentUrl}`)
  //     .log("URL should stay the same after loading");
  //   cy.get("table tbody tr")
  //     .should("have.length", 1)
  //     .log("Environments should properly filter issue list");
  //   cy.get(".environment-form .mat-select-value-text")
  //     .should("contain", environments.production)
  //     .log(`should show ${environments.production} in the dropdown`);

  //   cy.get(".title-cell")
  //     .find("a")
  //     .contains("RangeError")
  //     .click()
  //     .log("Should click into production error's issue detail page");
  //   cy.get(".tags .pseudo-chip-list")
  //     .contains(environments.production)
  //     .click()
  //     .log(
  //       "should have the environment tag",
  //       "on click, should go back to the issue page with the environment queryParam set"
  //     );
  //   cy.url().should("eq", `${Cypress.config().baseUrl}/${environmentUrl}`);

  //   // uncomment this to see a developed issue with events showing multiple user agent strings
  //   // cy.visit(`${organization.slug}/issues`);
  //   // cy.get(".title-cell").find("a").contains("<unknown>").click();
  // });

  it("should make 55 issues and select issues beyond the first page", function () {
    jsErrors.generateIssues(getDSN(this.dsn), 55);
    cy.visit(`/${organization.slug}/issues`);

    cy.get("#selectAll").click();
    cy.contains("Select all 55 issues that match this query");
    cy.get("#bulkUpdateProject").click();
    cy.contains("All 55 issues are currently selected");
    cy.get("#bulkMarkResolved").click();
    cy.log(
      "the ui will change, but to ensure this made a successful network call, we reload the page"
    );
    cy.reload();
    cy.contains("No events match your filters");
    cy.visit(
      `http://localhost:4200/${organization.slug}/issues?&query=is:resolved`
    );
    cy.get("gt-project-filter-bar mat-expansion-panel-header").click();
    cy.get("gt-project-filter-bar").contains("PitchFlip").click();
    cy.log(
      "now we are testing that the issues we resolved for a specific project are indeed resolved"
    );
    cy.get("table tbody").contains("What I'm really trying to say is:");
  });
});
