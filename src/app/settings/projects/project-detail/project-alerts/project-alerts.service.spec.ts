import { TestBed } from "@angular/core/testing";

import { ProjectAlertsService } from "./project-alerts.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";

describe("ProjectAlertsService", () => {
  let service: ProjectAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
    });
    service = TestBed.inject(ProjectAlertsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
