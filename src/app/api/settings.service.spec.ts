import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatomoModule } from "ngx-matomo";

import { SettingsService } from "./settings.service";

describe("SettingsService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatomoModule],
    })
  );

  it("should be created", () => {
    const service: SettingsService = TestBed.inject(SettingsService);
    expect(service).toBeTruthy();
  });
});
