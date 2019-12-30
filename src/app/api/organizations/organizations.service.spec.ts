import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { OrganizationsService } from "./organizations.service";
import { Organization } from "./organizations.interface";

describe("OrganizationsService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    })
  );

  it("should be created", () => {
    const service: OrganizationsService = TestBed.get(OrganizationsService);
    expect(service).toBeTruthy();
  });

  it("Initial organizations", () => {
    const service: OrganizationsService = TestBed.get(OrganizationsService);
    service.organizations$.subscribe((organizations: Organization[]) => {
      expect(organizations).toEqual([]);
    });
  });

  it("Initial active organization", () => {
    const service: OrganizationsService = TestBed.get(OrganizationsService);
    service.activeOrganization$.subscribe(activeOrganization => {
      expect(activeOrganization).toBe(null);
    });
  });
});
