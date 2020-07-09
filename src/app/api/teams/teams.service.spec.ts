import { TestBed } from "@angular/core/testing";

import { TeamsService } from "./teams.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";

describe("TeamsService", () => {
  let service: TeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
    });
    service = TestBed.inject(TeamsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
