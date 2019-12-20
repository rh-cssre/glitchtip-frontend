import { TestBed } from "@angular/core/testing";

import { OrganizationsService } from "./organizations.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Organization } from "./organizations.interface";

describe("OrganizationsService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] })
  );

  it("should be created", () => {
    const service: OrganizationsService = TestBed.get(OrganizationsService);
    expect(service).toBeTruthy();
  });

  fit("Initial organizations", () => {
    const service: OrganizationsService = TestBed.get(OrganizationsService);
    service.organziations$.subscribe((organizations: Organization[]) => {
      expect(organizations).toEqual([]);
    });
  });

  fit("Initial active organization", () => {
    const service: OrganizationsService = TestBed.get(OrganizationsService);
    service.activeOrganization$.subscribe(activeOrganization => {
      expect(activeOrganization).toBe(null);
    });
  });
});
