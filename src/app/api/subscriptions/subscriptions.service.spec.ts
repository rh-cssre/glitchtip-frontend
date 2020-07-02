import { TestBed } from "@angular/core/testing";

import { SubscriptionsService } from "./subscriptions.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";

describe("SubscriptionsService", () => {
  let service: SubscriptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
    });
    service = TestBed.inject(SubscriptionsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
