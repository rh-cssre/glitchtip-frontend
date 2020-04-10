import { TestBed } from "@angular/core/testing";

import { RegisterService } from "./register.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthModule } from "../api/auth/auth.module";

describe("RegisterService", () => {
  let service: RegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, AuthModule],
    });
    service = TestBed.inject(RegisterService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
