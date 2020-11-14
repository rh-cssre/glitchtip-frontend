import { seedBackend, requestLogin } from "./utils";
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
    cy.visit(`/settings/${organization.name}/projects/new`);
    cy.contains("Create a New Project");
    cy.get("#create-project-submit").click();
    cy.contains("Enter a project name");
    cy.get("input[formcontrolname=name]").type(
      "While having too many characters in a project name would be rare, this test ensures that the server error field works."
    );
    cy.get("#create-project-submit").click();
    cy.contains("Bad Request: 400");
  });

  it("create new project with new team but no platform", () => {
    cy.visit(`/settings/${organization.name}/projects/new`);
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
    cy.url().should(
      "eq",
      "http://localhost:4200/settings/cypresstestorg/projects/newcypresstestproject"
    );
  });

  it("create new project with platform and existing team", () => {
    cy.visit(`/settings/${organization.name}/projects/new`);
    cy.contains("Create a New Project");
    cy.get("input[formcontrolname=name]").type(newProject.name);
    // cy.get("[formcontrolname=platform]").type(newProject.platform);
    cy.get("#create-project-submit").click();
    cy.contains(`${newProject.name} has been created`);
    cy.url().should(
      "eq",
      "http://localhost:4200/settings/cypresstestorg/projects/newcypresstestproject"
    );
  });
});

describe("Edit and Delete a project", () => {
  beforeEach(() => {
    seedBackend();
    requestLogin();
    cy.visit(`/settings/${organization.name}/projects/${project.name}`);
  });

  it("should edit the name of a project", () => {
    cy.get("input[formcontrolname=name]")
      .clear()
      .type(
        "While having too many characters in a project name would be rare, this test ensures that the server error field works."
      );
    cy.get("#update-project-name").click();
    cy.get("mat-error").contains("Bad Request: 400");
    cy.get("input[formcontrolname=name]").clear();
    cy.get("#update-project-name").click();
    cy.get("mat-error").contains("Enter a project name");
    cy.get("input[formcontrolname=name]").type("New Project Name");
    cy.get("#update-project-name").click();
    cy.contains("Settings for New Project Name");
    // delete from db
    cy.get("#delete-project").click();
  });

  it("edit the project platform", () => {
    // cy.get("[formcontrolname=platform]")
    //   .clear()
    //   .type(
    //     "While having too many characters in a project name would be rare, this test ensures that the server error field works."
    //   );
    cy.get("#update-project-platform").click();
    cy.get("mat-error").contains("Bad Request: 400");
    // cy.get("[formcontrolname=platform]").clear().type("Cool new platform");
    cy.get("#update-project-platform").click();
    cy.contains("Your project platform has been updated to Cool new platform");
  });

  it("should remove the project and redirect to projects page", () => {
    cy.get("#delete-project").click();
    cy.contains("Your project has been sucessfully deleted");
    cy.url().should(
      "eq",
      `http://localhost:4200/settings/${organization.name}/projects`
    );
  });
});
