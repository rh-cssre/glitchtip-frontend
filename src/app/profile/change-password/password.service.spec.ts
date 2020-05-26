import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { PasswordService } from "./password.service";

describe("PasswordService", () => {
  let service: PasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(PasswordService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
