import { TestBed } from "@angular/core/testing";
import { MICRO_SENTRY_CONFIG, MicroSentryService } from "@micro-sentry/angular";

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
      providers: [
        MicroSentryService,
        { provide: MICRO_SENTRY_CONFIG, useValue: {} },
      ],
    });
    service = TestBed.inject(ProjectAlertsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("find and replace should return array of project alerts with new time and quantity", () => {
    const currentAlerts = [
      {
        pk: 79,
        timespan_minutes: 4,
        quantity: 111,
        uptime: true,
        alertRecipients: [],
      },
      {
        pk: 78,
        timespan_minutes: 5,
        quantity: 3,
        uptime: false,
        alertRecipients: [],
      },
      {
        pk: 77,
        timespan_minutes: 5,
        quantity: 4,
        uptime: true,
        alertRecipients: [],
      },
    ];
    const updatedAlertResp = {
      pk: 78,
      timespan_minutes: 3,
      quantity: 11,
      uptime: true,
      alertRecipients: [],
    };
    const newAlerts = [
      {
        pk: 79,
        timespan_minutes: 4,
        quantity: 111,
        uptime: true,
        alertRecipients: [],
      },
      {
        pk: 78,
        timespan_minutes: 3,
        quantity: 11,
        uptime: true,
        alertRecipients: [],
      },
      {
        pk: 77,
        timespan_minutes: 5,
        quantity: 4,
        uptime: true,
        alertRecipients: [],
      },
    ];
    const updatedAlerts = service.findAndReplaceAlert(
      currentAlerts,
      updatedAlertResp
    );
    expect(updatedAlerts).toEqual(newAlerts);
  });
});
