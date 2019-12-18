import { TestBed } from "@angular/core/testing";

import { OrganizationsService } from "./organizations.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("OrganizationsService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] })
  );

  it("should be created", () => {
    const service: OrganizationsService = TestBed.get(OrganizationsService);
    expect(service).toBeTruthy();
  });
});
