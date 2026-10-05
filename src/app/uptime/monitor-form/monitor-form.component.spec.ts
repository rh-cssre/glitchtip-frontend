// Type-only: declares the $localize global for the spec program. The runtime
// polyfill is already loaded by the test builder, and the app build picks the
// type up via main.ts, which the spec tsconfig does not include.
import type {} from "@angular/localize/init";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MonitorFormComponent } from "./monitor-form.component";
import { OrganizationsService } from "src/app/api/organizations.service";
import { EnvironmentsService } from "src/app/api/environments.service";
import { SubscriptionService } from "src/app/api/subscriptions/subscription.service";
import { client } from "src/app/shared/api/api";

// The org endpoint reports Environment ids. Project environments are looked up
// by name against this list, so these ids are what may be submitted.
const ORG_ENVIRONMENTS = [
  { id: 1, name: "production" },
  { id: 3, name: "staging" },
  { id: 47, name: "canary" },
];

const ORG_PROJECTS = [
  { id: "2", slug: "api-gateway", name: "api-gateway" },
  { id: "4", slug: "worker-queue", name: "worker-queue" },
];

// Association ids here are deliberately different from the Environment ids
// above, so a test fails if the component ever submits one.
const PROJECT_ENVIRONMENTS: Record<
  string,
  { id: number; name: string; isHidden: boolean }[]
> = {
  "api-gateway": [
    { id: 67, name: "production", isHidden: false },
    { id: 68, name: "staging", isHidden: false },
    { id: 69, name: "qa", isHidden: true },
  ],
  "worker-queue": [{ id: 70, name: "production", isHidden: false }],
};

describe("MonitorFormComponent environment scoping", () => {
  let fixture: ComponentFixture<MonitorFormComponent>;
  let component: MonitorFormComponent;

  beforeEach(async () => {
    // Stub at the openapi-fetch client, the seam the resource actually calls;
    // a relative URL cannot be parsed by fetch under Node.
    vi.spyOn(client, "GET").mockImplementation((async (
      _url: string,
      init: { params?: { path?: { project_slug?: string } } },
    ) => {
      const projectSlug = init?.params?.path?.project_slug;
      const data = projectSlug ? (PROJECT_ENVIRONMENTS[projectSlug] ?? []) : [];
      return {
        data,
        error: undefined,
        response: new Response(null, {
          status: 200,
          headers: {
            link: '<http://localhost/>; rel="previous"; results="false"',
            "x-hits": String(data.length),
            "x-max-hits": String(data.length),
          },
        }),
      };
    }) as unknown as typeof client.GET);

    await TestBed.configureTestingModule({
      imports: [MonitorFormComponent],
      providers: [
        {
          provide: OrganizationsService,
          useValue: {
            activeOrganizationSlug: signal("org"),
            activeOrganizationProjects: signal(ORG_PROJECTS),
          },
        },
        {
          provide: EnvironmentsService,
          useValue: { orgEnvironments: signal(ORG_ENVIRONMENTS) },
        },
        {
          provide: SubscriptionService,
          useValue: { totalEventsAllowed: signal(null) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MonitorFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("formError", null);
    fixture.componentRef.setInput("loading", false);
    fixture.detectChanges();
  });

  async function selectProject(projectID: string | null) {
    component.formProject.setValue(projectID);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it("disables the environment field until a project is chosen", () => {
    expect(component.environmentDisabled()).toBe(true);
    expect(component.formEnvironment.disabled).toBe(true);
    expect(component.environmentOptions()).toEqual([]);
  });

  it("offers only the selected project's environments", async () => {
    await selectProject("4"); // worker-queue has production only
    expect(component.environmentDisabled()).toBe(false);
    expect(component.environmentOptions().map((e) => e.name)).toEqual([
      "production",
    ]);
  });

  it("submits the Environment id, never the association id", async () => {
    await selectProject("2");
    const options = component.environmentOptions();
    expect(options).toEqual([
      { name: "production", id: 1 },
      { name: "staging", id: 3 },
    ]);
  });

  it("omits environments hidden on the project", async () => {
    await selectProject("2"); // api-gateway hides qa
    expect(component.environmentOptions().map((e) => e.name)).not.toContain(
      "qa",
    );
  });

  it("keeps a selection the new project also has", async () => {
    await selectProject("2");
    component.formEnvironment.setValue(1); // production
    await selectProject("4"); // worker-queue also has production
    expect(component.formEnvironment.value).toEqual(1);
  });

  it("clears a selection the new project does not have", async () => {
    await selectProject("2");
    component.formEnvironment.setValue(3); // staging
    await selectProject("4"); // worker-queue has no staging
    expect(component.formEnvironment.value).toBeNull();
  });

  it("clears the environment when the project is removed", async () => {
    await selectProject("2");
    component.formEnvironment.setValue(1);
    await selectProject(null);
    expect(component.formEnvironment.value).toBeNull();
    expect(component.formEnvironment.disabled).toBe(true);
  });

  it("still submits the environment while the control is enabled", async () => {
    await selectProject("2");
    component.formEnvironment.setValue(3);
    const emitted: unknown[] = [];
    component.formSubmitted.subscribe((event) => emitted.push(event));
    component.formName.setValue("monitor");
    component.formUrl.setValue("https://example.com");
    component.submit();
    expect((emitted[0] as { environmentID: number }).environmentID).toEqual(3);
  });
});
