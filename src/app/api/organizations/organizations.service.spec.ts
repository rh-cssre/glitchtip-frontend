import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";

import { OrganizationsService } from "./organizations.service";
import { Organization } from "./organizations.interface";
import { organizationList } from "./organization-test-data";
import { MaterialModule } from "src/app/shared/material.module";

describe("OrganizationsService", () => {
  let httpTestingController: HttpTestingController;
  let service: OrganizationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule]
    });
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(OrganizationsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Initial organizations", () => {
    service = TestBed.get(OrganizationsService);
    service.organizations$.subscribe((organizations: Organization[]) => {
      expect(organizations).toEqual([]);
    });
  });

  it("Initial active organization", () => {
    service = TestBed.get(OrganizationsService);
    service.activeOrganizationId$.subscribe(activeOrganization => {
      expect(activeOrganization).toBe(null);
    });
  });

  it("retrieves a list of organizations, with the active org set to the first org id", () => {
    const testData: Organization[] = organizationList;
    service.retrieveOrganizations().toPromise();
    const req = httpTestingController.expectOne(`/api/0/organizations/`);
    req.flush(testData);
    service.organizations$.subscribe(orgs => expect(orgs).toEqual(testData));
    service.activeOrganizationId$.subscribe(active =>
      expect(active).toEqual(testData[0].id)
    );
  });

  it("changes the active organization", () => {
    const testData = organizationList[1];
    service.changeActiveOrganization(1);
    service.activeOrganizationId$.subscribe(org =>
      expect(org).toBe(testData.id)
    );
  });
});
