import { seedBackend, requestLogin } from "./utils.cy";
import { seededOrg, seededProject3, seededTeam } from "../fixtures/variables";

function createProject(body: { name: string; platform?: string }) {
  return cy.getCookie("csrftoken").then((cookie) =>
    cy.request({
      method: "POST",
      url: `/api/0/teams/${seededOrg.slug}/${seededTeam.name}/projects/`,
      headers: { "X-CSRFToken": cookie!.value },
      body,
    }),
  );
}

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
});

describe(
  "Issue Zero States - new projects",
  { defaultCommandTimeout: 6000, requestTimeout: 10000 },
  () => {
    before(() => {
      seedBackend(true, true);
      requestLogin();
    });

    it("shows correct zero state for each project configuration", () => {
      cy.intercept("GET", "/api/0/organizations/*/issues/?*").as("issues");

      // Create all projects upfront so we only seed and log in once
      createProject({ name: "test-python", platform: "python" })
        .then((res) => res.body.id)
        .as("pythonId");
      createProject({ name: "test-other", platform: "other" })
        .then((res) => res.body.id)
        .as("otherId");
      createProject({ name: "test-noplatform" })
        .then((res) => res.body.id)
        .as("noplatformId");
      // A fresh org with no projects, to test that specific zero state
      cy.getCookie("csrftoken").then((cookie) =>
        cy.request({
          method: "POST",
          url: "/api/0/organizations/",
          headers: { "X-CSRFToken": cookie!.value },
          body: { name: "zero-states-empty-org" },
        }),
      )
        .then((res) => res.body.slug)
        .as("emptyOrgSlug");

      // Platform with SDK docs: shows platform-specific markdown with DSN substituted
      cy.get("@pythonId").then((id) => {
        cy.request(`/api/0/projects/${seededOrg.slug}/test-python/keys/`).then(
          (keysRes) => {
            const dsn = keysRes.body[0].dsn.public;
            cy.visit(`/${seededOrg.slug}/issues?project=${id}`);
            cy.wait("@issues");
            cy.get("[data-cy=sdk-docs]").should("contain", dsn);
          },
        );
      });
      // "Other" platform: no specific docs, shows generic notice
      cy.get("@otherId").then((id) => {
        cy.visit(`/${seededOrg.slug}/issues?project=${id}`);
        cy.wait("@issues");
        cy.get("[data-cy=platform-other-notice]");
      });
      // No platform set: prompt to configure one in settings
      cy.get("@noplatformId").then((id) => {
        cy.visit(`/${seededOrg.slug}/issues?project=${id}`);
        cy.wait("@issues");
        cy.get("[data-cy=platform-settings-link]");
      });
      // Org with no projects at all
      cy.get("@emptyOrgSlug").then((slug) => {
        cy.visit(`/${slug}/issues`);
        cy.wait("@issues");
        cy.get("[data-cy=no-projects]");
      });
    });

  },
);

describe(
  "Issue Zero States - existing events",
  { defaultCommandTimeout: 6000, requestTimeout: 10000 },
  () => {
    beforeEach(() => {
      seedBackend(true, true);
      requestLogin();
      cy.intercept("GET", "/api/0/organizations/*/issues/?*").as("issues");
    });

    it("shows no-match message for a project that has had events", () => {
      cy.request(
        `/api/0/projects/${seededOrg.slug}/${seededProject3.slug}/`,
      ).then((res) => {
        cy.visit(
          `/${seededOrg.slug}/issues?project=${res.body.id}&query=is%3Aresolved`,
        );
        cy.wait("@issues");
        cy.get("[data-cy=no-results]");
      });
    });
  },
);
