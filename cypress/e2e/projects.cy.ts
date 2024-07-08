import { seedBackend, requestLogin } from "./utils.cy";
import {
  organization,
  newTeam,
  newProject,
  project,
} from "../fixtures/variables";

describe("Create New Project", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
  });

  it("should render appropriate field and server side errors", () => {
    cy.visit(`/${organization.slug}/settings/projects/new`);
    cy.contains("Create a New Project");
    cy.get("#create-project-submit").click();
    cy.get("[data-cy='project-name-error-required']");
    cy.get("input[formcontrolname=name]").type(
      "While having too many characters in a project name would be rare, this test ensures that the server error field works."
    );
    cy.get("#create-project-submit").click();
    cy.get("[data-cy=project-name-error-length]");
  });

  it("create new project with new team but no platform", () => {
    cy.visit(`/${organization.slug}/settings/projects/new`);
    cy.contains("Create a New Project");
    cy.get("#create-team-from-projects").click();
    cy.contains(
      "Your team slug can only consist of letters, numbers, underscores and/or hyphens."
    );
    cy.get("input[formcontrolname=slug]").type(newTeam.slug);
    cy.get("#create-team-submit").click();
    cy.contains(new RegExp("^" + newTeam.slug + "$", "g"));
    cy.get("input[formcontrolname=name]").type(newProject.name);
    cy.get("#create-project-submit").click();
    cy.contains(`${newProject.name} has been created`);
    // Don't think I can get the project ID for the test
    // cy.url().should(
    //   "contain",
    //   `http://localhost:4200/${organization.slug}/issues?project`
    // );
  });

  it("create new project with platform and existing team", () => {
    cy.visit(`/${organization.slug}/settings/projects/new`);
    cy.contains("Create a New Project");
    cy.get("input[formcontrolname=name]").type(newProject.name);
    cy.get("[formcontrolname=platform] [data-test]").first().click();
    cy.get("#create-project-submit").click();
    // cy.contains(`${newProject.name} has been created`);
    //   cy.url().should(
    //     "contain",
    //     `http://localhost:4200/${organization.slug}/issues?project`
    //   );
  });
});

describe("Edit and Delete a project", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
    cy.visit(`/${organization.slug}/settings/projects/${project.slug}`);
  });

  it("should edit the name of a project", () => {
    cy.get("input[formcontrolname=name]")
      .clear()
      .type(
        "While having too many characters in a project name would be rare, this test ensures that the server error field works."
      );
    cy.get("#update-project-name").click();
    cy.get("[data-cy='project-name-error-length']");
    cy.get("input[formcontrolname=name]").clear();
    cy.get("#update-project-name").click();
    cy.get("[data-cy='project-name-error-required']");
    cy.get("input[formcontrolname=name]").type("New Project Name");
    cy.get("#update-project-name").click();
    cy.contains("Settings for New Project Name");
    // delete from db
    cy.get("#delete-project").click();
  });

  it("edit the project platform", () => {
    cy.get("[data-test-panel-header]").click();
    cy.get("[data-test]").last().click();
    cy.get("#update-project-platform").click();
    cy.contains("Your project platform has been updated to WSGI");
  });

  it("should remove the project and redirect to projects page", () => {
    cy.get("#delete-project").click();
    cy.contains("Your project has been sucessfully deleted");
    cy.url().should(
      "eq",
      `http://localhost:4200/${organization.slug}/settings/projects`
    );
  });
});

describe("Add and edit alerts", () => {
  beforeEach(() => {
    seedBackend(true);
    requestLogin();
    cy.visit(`/${organization.slug}/settings/projects/${project.slug}`);
  });

  it("should add a project alert, remove email recipient, add email recipient back", () => {
    cy.get("#create-new-alert").click();
    cy.get("[data-cy=quantity]").clear().type("2");
    cy.get("button").contains("submit").click();
    cy.contains("Remove Alert 1");
    cy.get("[data-cy=quantity]").should("have.value", "2");

    cy.get("#delete-recipient").click();
    cy.contains("This alert isn't being sent anywhere.");

    cy.get("button").contains("Add An Alert Recipient").click();
    cy.get("[data-cy=recipient-type]")
      .click()
      .get("mat-select")
      .get("mat-option")
      .contains("Email")
      .click();
    cy.get("button").contains("Add Recipient").click();
    cy.contains("Send an email to team members on this project.");
  });

  it("should add an alert for uptime notifications, then update it to work for error notifications", () => {
    cy.get("#create-new-alert").click();
    cy.get("[data-cy=error-check]").click();
    cy.contains(
      "Please select events or uptime monitor triggers for your alert."
    );
    cy.get("[data-cy=uptime-check]").click();
    cy.get("button").contains("submit").click();
    cy.contains("Success! Your new alert has been added.");

    cy.get("[data-cy=error-check]").find("input").should("not.be.checked");
    cy.get("[data-cy=uptime-check]").find("input").should("be.checked");

    cy.get("[data-cy=error-check]").click();
    cy.get("[data-cy=update-container]").contains("Update").click();
    cy.contains("Success: Your alert has been updated");

    cy.get("[data-cy=error-check]").find("input").should("be.checked");
    cy.get("[data-cy=uptime-check]").find("input").should("be.checked");
  });
});
