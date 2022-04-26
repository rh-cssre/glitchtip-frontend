import { seedBackend, requestLogin, getDSN } from "./utils";
import * as testTransactions from "../fixtures/transactions";
import { organization } from "../fixtures/variables";

describe("Transaction Groups Page", () => {
  beforeEach(() => {
    seedBackend(true);
    requestLogin();
    cy.visit(`/${organization.slug}/issues`);
    // Need the DSN to do this from the frontend
    cy.get("gt-project-filter-bar mat-expansion-panel-header").click();
    cy.get("gt-project-filter-bar").contains("PitchFlip").click();
    cy.get("[data-test-dsn]").invoke("val").as("dsn");
  });

  it("should make 55 transactions, and see five on the second page", function () {
    testTransactions.generateTransactions(getDSN(this.dsn, "envelope"), 55);
    cy.visit(`/${organization.slug}/performance/transaction-groups`);

    cy.get("[data-cy=keyboard-right]").click();
    cy.get("a:contains(something/somewhere)").should("have.length", 5);
  });
});
