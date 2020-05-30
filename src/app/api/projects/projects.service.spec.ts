import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { ProjectsService } from "./projects.service";
import { RouterTestingModule } from "@angular/router/testing";
import { MatomoModule } from "ngx-matomo";

describe("ProjectsService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatomoModule],
    })
  );

  it("should be created", () => {
    const service: ProjectsService = TestBed.inject(ProjectsService);
    expect(service).toBeTruthy();
  });
});
