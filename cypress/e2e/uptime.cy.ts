import { seedBackend, requestLogin } from "./utils.cy";
import { seededOrg, seededProject1, seededMonitorName } from "../fixtures/variables";

describe("List, add, update and delete uptime Monitors", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
  });

  it("Should list a single monitor, see alert info for that monitor, then update that monitor and see updated monitor on list", () => {
    cy.visit(`/${seededOrg.slug}/uptime-monitors/`);
    cy.contains("seeded-monitor").click();
    cy.wait(1000);
    cy.contains(`Uptime details for ${seededMonitorName}`);
    cy.contains("This project has no uptime alerts configured");
    cy.get("#monitor-settings").click();
    cy.get("#monitor-name")
      .should("have.value", seededMonitorName)
      .clear()
      .type("new name");
    cy.get("button").contains("Update Monitor").click();
    cy.visit(`/${seededOrg.slug}/uptime-monitors/`);
    cy.contains("new name");
  });

  it("should delete a monitor and not see that monitor on list", () => {
    cy.visit(`/${seededOrg.slug}/uptime-monitors/`);
    cy.contains(seededMonitorName).click();
    cy.get("#monitor-settings").click();
    cy.on("window:confirm", (text) => {
      expect(text).to.contains("Are you sure you want delete this monitor?");
    });
    cy.get("#delete-monitor").click();
    cy.visit(`/${seededOrg.slug}/uptime-monitors`);
    cy.contains("cytestmonitor").should("not.exist");
  });

  it("Should not be able to add monitor with invalid values", () => {
    cy.visit(`/${seededOrg.slug}/uptime-monitors/new`);
    cy.get("[data-cy=monitor-type]")
      .click()
      .get("mat-option")
      .contains("GET")
      .click();
    cy.get("[data-cy=site-url]").type("invalid url");
    cy.get("[data-cy=interval]").clear().type("86400");
    cy.get("[data-cy=monitor-submit]").click();
    cy.get("[data-cy=expected-status]").clear();
    cy.contains("Enter a monitor name");
    cy.contains("Enter a valid URL");
    cy.contains("Enter a status code number");
    cy.contains("Must be less than 32768.");
  });

  it("Should add a single monitor and see that monitor on list", () => {
    cy.visit(`/${seededOrg.slug}/uptime-monitors/`);
    cy.get("#add-monitor").click();
    cy.get("#monitor-name").type("second-monitor");
    cy.get("[data-cy=site-url]").type("www.twitter.com");
    cy.get("[data-cy=associated-project]")
      .click()
      .get("mat-select")
      .get("mat-option")
      .contains(seededProject1.name)
      .click();
    cy.get("[data-cy=monitor-type]")
      .click()
      .get("mat-option")
      .contains("Heartbeat")
      .click();
    cy.get("[data-cy=interval]").clear().type("605");
    cy.get("[data-cy=monitor-submit]").click();
    cy.contains("Uptime details for second-monitor");
    cy.visit(`/${seededOrg.slug}/uptime-monitors/`);
    cy.contains("second-monitor");
  });
});
