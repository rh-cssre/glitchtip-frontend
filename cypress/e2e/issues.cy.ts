import { seedBackend, requestLogin, getDSN, uniqueId } from "./utils.cy";
import { seededOrg, seededProject1 } from "../fixtures/variables";

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
        "/api/0/organizations/*/issues/?query=is%3Aunresolved",
      ).as("initialIssuesRequest");
      cy.visit(`/${seededOrg.slug}/issues`);
      cy.wait("@initialIssuesRequest");

      cy.get("[data-cy=selectAll]").click();
      cy.contains("Select all 55 issues that match this query");
      cy.get("[data-cy=bulkUpdateProject]").click();
      cy.contains("All 55 issues are currently selected");

      cy.intercept("PUT", "/api/0/organizations/*/issues/").as(
        "issuesUpdateRequest",
      );
      cy.get("[data-cy='bulkMarkResolved']").click();
      cy.wait("@issuesUpdateRequest");
      cy.log(
        "To ensure this made a successful network call, we search for resolved events.",
      );
      cy.intercept(
        "GET",
        "/api/0/organizations/*/issues/?query=is%3Aresolved",
      ).as("resolvedIssuesRequest");
      cy.get('[data-cy="list-search-field"]').clear().type("is:resolved");
      cy.get('[data-cy="list-search-form"]').submit();
      cy.wait("@resolvedIssuesRequest");

      cy.get('[data-cy="list-title"]').contains("Issues (55)");
    },
  );

  // it("should test event detail request body structured and raw views", function () {
  //   const testEvent = {
  //     message: "Test Event with POST Body",
  //     level: "error",
  //     event_id: uniqueId(),
  //     platform: "javascript",
  //     sdk: {
  //       name: "sentry.javascript.browser",
  //       packages: [{ name: "npm:@sentry/browser", version: "5.29.2" }],
  //       version: "5.29.2",
  //     },
  //     timestamp: Date.now() / 1000,
  //     request: {
  //       url: "http://localhost:4201/api/test",
  //       method: "POST",
  //       data: {
  //         a: "foo",
  //         b: [1, 2]
  //       },
  //       headers: {
  //         "Content-Type": "application/json",
  //         "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0"
  //       }
  //     }
  //   };
  //   cy.visit(`/${organization.slug}/issues`);
  //   cy.wait(1000);
  //   cy.get("gt-project-filter-bar mat-expansion-panel-header").click();
  //   cy.get("gt-project-filter-bar").contains(project.name).click();
  //   cy.get("[data-test-dsn]")
  //     .invoke("val")
  //     .then((dsn) => {
  //       const url = getDSN(dsn as string);
  //       cy.request("POST", url, testEvent);
  //       cy.wait(3000);
  //       cy.visit(`/${organization.slug}/issues`);
  //       cy.wait(2000);
  //       cy.get(".title-cell").find("a").first().click();
  //       cy.wait(2000);
  //       cy.get('mat-button-toggle[value="structured"]').should('have.class', 'mat-button-toggle-checked');
  //       cy.get('gt-entry-data').contains('a').parent().should('contain', 'foo');
  //       cy.get('gt-entry-data').contains('b').parent().should('contain', '[1,2]');
  //       cy.get('mat-button-toggle[value="raw"]').click();
  //       cy.wait(500);
  //       cy.get('mat-button-toggle[value="raw"]').should('have.class', 'mat-button-toggle-checked');
  //       cy.get('pre code[gtPrism]').should('contain', '"a": "foo"');
  //       cy.get('pre code[gtPrism]').should('contain', '"b": [');
  //       cy.get('pre code[gtPrism]').should('contain', '1,');
  //       cy.get('pre code[gtPrism]').should('contain', '2');
  //     });
  // });
});
