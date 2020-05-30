import { NgZone } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { OrganizationsService } from "./organizations.service";
import { Organization } from "./organizations.interface";
import { organizationList } from "./organization-test-data";
import { MaterialModule } from "src/app/shared/material.module";
import { routes } from "src/app/app-routing.module";
import { MatomoModule } from "ngx-matomo";

describe("OrganizationsService", () => {
  let httpTestingController: HttpTestingController;
  let service: OrganizationsService;
  let router: Router;
  let zone: NgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        MaterialModule,
        MatomoModule,
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(OrganizationsService);
    router = TestBed.inject(Router);
    zone = TestBed.inject(NgZone);
  });

  it("Initial organizations", () => {
    service.organizations$.subscribe((organizations: Organization[]) => {
      expect(organizations).toEqual([]);
    });
  });

  it("Initial active organization", () => {
    service = TestBed.inject(OrganizationsService);
    service.activeOrganizationId$.subscribe((activeOrganization) => {
      expect(activeOrganization).toBe(null);
    });
  });

  it("retrieves a list of organizations, with the active org set to the first org id", () => {
    const testData: Organization[] = organizationList;
    service.retrieveOrganizations().toPromise();
    const req = httpTestingController.expectOne(`/api/0/organizations/`);
    req.flush(testData);
    service.organizations$.subscribe((orgs) => expect(orgs).toEqual(testData));
    service.activeOrganizationId$.subscribe((active) =>
      expect(active).toEqual(testData[0].id)
    );
  });

  it("changes the active organization", () => {
    const testData = organizationList[1];
    service.changeActiveOrganization(1);
    service.activeOrganizationId$.subscribe((org) =>
      expect(org).toBe(testData.id)
    );
  });

  it("navigates when changing active organization", async () => {
    // Switch from one issues to another
    await zone.run(() =>
      router.navigate(["organizations", organizationList[0].slug, "issues"])
    );
    const navigateSpy = spyOn(router, "navigate");
    // @ts-ignore
    service.setOrganizations(organizationList);
    // @ts-ignore
    service.setActiveOrganizationId(2);
    service.changeActiveOrganization(1);
    const req = httpTestingController.expectOne(
      `/api/0/organizations/${organizationList[1].slug}/`
    );
    req.flush(organizationList[1]);
    expect(navigateSpy).toHaveBeenCalledWith([
      "organizations",
      organizationList[1].slug,
      "issues",
    ]);
  });

  it("navigates within settings when changing active organization", async () => {
    // Remake testing module to inject mock ActivatedRoute
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        MaterialModule,
        MatomoModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              firstChild: {
                url: [{ path: "settings" }, { path: organizationList[0].slug }],
              },
            },
          },
        },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(OrganizationsService);
    router = TestBed.inject(Router);
    // Switch from one issues to another
    await zone.run(() =>
      router.navigate(["settings", organizationList[0].slug])
    );
    const navigateSpy = spyOn(router, "navigate");
    // @ts-ignore
    service.setOrganizations(organizationList);
    // @ts-ignore
    service.setActiveOrganizationId(2);
    service.changeActiveOrganization(1);
    const req = httpTestingController.expectOne(
      `/api/0/organizations/${organizationList[1].slug}/`
    );
    req.flush(organizationList[1]);
    expect(navigateSpy).toHaveBeenCalledWith([
      "settings",
      organizationList[1].slug,
    ]);
  });
});
