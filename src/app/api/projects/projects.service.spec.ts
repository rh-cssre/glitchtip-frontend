import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { ProjectsService } from "./projects.service";
import { RouterTestingModule } from "@angular/router/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";

describe("ProjectsService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
    })
  );

  it("should be created", () => {
    const service: ProjectsService = TestBed.inject(ProjectsService);
    expect(service).toBeTruthy();
  });
});
