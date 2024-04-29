// tslint:disable:no-any
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MICRO_SENTRY_CONFIG, MicroSentryService } from "@micro-sentry/angular";

import { MonitorService } from "./monitor.service";

import { RouterTestingModule } from "@angular/router/testing";
import { monitorDetail, convertedSeries } from "./test-data";

describe("MonitorService", () => {
  let httpTestingController: HttpTestingController;
  let service: MonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      providers: [
        MicroSentryService,
        { provide: MICRO_SENTRY_CONFIG, useValue: {} },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MonitorService);
  });

  it("should convert monitor checks to a formatted data series", () => {
    const testData = monitorDetail;
    (service as any).retrieveMonitorDetails("uptime-chart-testing", "1");
    const req = httpTestingController.expectOne(
      "/api/0/organizations/uptime-chart-testing/monitors/1/"
    );
    req.flush(testData, { headers: { Link: "link header info" } });
    service.activeMonitorRecentChecksSeries$.subscribe((series) =>
      expect(series).toEqual(convertedSeries)
    );
  });
});
