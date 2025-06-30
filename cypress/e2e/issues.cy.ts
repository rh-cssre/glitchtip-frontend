import { seedBackend, requestLogin } from "./utils.cy";
import { organization } from "../fixtures/variables";

describe("Issues Page", () => {
  beforeEach(() => {
    seedBackend(true, true);
    requestLogin();
  });

  it(
    "should make 55 issues and resolve issues beyond the first page",
    { defaultCommandTimeout: 6000, requestTimeout: 10000 },
    function () {
      cy.intercept(
        "GET",
        "/api/0/organizations/*/issues/?query=is%3Aunresolved"
      ).as("initialIssuesRequest");
      cy.visit(`/${organization.slug}/issues`);
      cy.wait("@initialIssuesRequest");

      cy.get("#selectAll").click();
      cy.contains("Select all 55 issues that match this query");
      cy.get("#bulkUpdateProject").click();
      cy.contains("All 55 issues are currently selected");

      cy.intercept("PUT", "/api/0/organizations/*/issues/").as(
        "issuesUpdateRequest"
      );
      cy.get("#bulkMarkResolved").click();
      cy.wait("@issuesUpdateRequest");
      cy.log(
        "To ensure this made a successful network call, we search for resolved events."
      );
      cy.intercept(
        "GET",
        "/api/0/organizations/*/issues/?query=is%3Aresolved"
      ).as("resolvedIssuesRequest");
      cy.get('[data-cy="list-search-field"]').clear().type("is:resolved");
      cy.get('[data-cy="list-search-form"]').submit();
      cy.wait("@resolvedIssuesRequest");

      cy.get('[data-cy="list-title"]').contains("Issues (55)");
    }
  );
});
