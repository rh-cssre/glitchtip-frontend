import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";

import { OrganizationsService } from "./organizations.service";
import { Organization } from "./organizations.interface";

import { organizationList } from "./organization-test-data";

describe("OrganizationsService", () => {
  let httpTestingController: HttpTestingController;
  let service: OrganizationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
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
    service.activeOrganization$.subscribe(activeOrganization => {
      expect(activeOrganization).toBe(null);
    });
  });

  it("retrieve a list of organizations", () => {
    const testData: Organization[] = organizationList;
    service.retrieveOrganizations().toPromise();
    const req = httpTestingController.expectOne(`/api/0/organizations/`);
    req.flush(testData);
    service.organizations$.subscribe(orgs => expect(orgs).toEqual(testData));
  });

  it("change active organization", () => {
    const testData = organizationList[1];
    service.changeActiveOrganization(1);
    service.activeOrganization$.subscribe(org => expect(org).toBe(testData.id));
  });
});
