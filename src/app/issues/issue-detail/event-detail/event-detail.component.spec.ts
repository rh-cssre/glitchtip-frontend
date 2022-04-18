// tslint:disable:no-any
import { Component, Input } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MICRO_SENTRY_CONFIG, MicroSentryService } from "@micro-sentry/angular";

import { EventDetailComponent } from "./event-detail.component";
import { MaterialModule } from "src/app/shared/material.module";
import { EntryRequestComponent } from "./entry-request/entry-request.component";
import { EntryDataComponent } from "../../../shared/entry-data/entry-data.component";
import { IssueDetailService } from "../issue-detail.service";
import dotnetEvent from "./test-data/dotnet-event.json";

@Component({ selector: "gt-contexts", template: "" })
class ContextsStubComponent {}

@Component({ selector: "gt-entry-message", template: "" })
class EntryMessageStubComponent {}

@Component({ selector: "gt-entry-exception", template: "" })
class EntryExceptionStubComponent {
  @Input() eventTitle: any;
  @Input() eventPlatform: any;
}

@Component({ selector: "gt-entry-csp", template: "" })
class EntryCspStubComponent {}

@Component({ selector: "gt-entry-breadcrumbs", template: "" })
class EntryBreadcrumbsStubComponent {}

describe("EventDetailComponent", () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;
  let service: IssueDetailService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          EventDetailComponent,
          EntryRequestComponent,
          EntryDataComponent,
          EntryCspStubComponent,
          EntryExceptionStubComponent,
          EntryMessageStubComponent,
          ContextsStubComponent,
          EntryBreadcrumbsStubComponent,
        ],
        imports: [RouterTestingModule, HttpClientTestingModule, MaterialModule],
        providers: [
          MicroSentryService,
          { provide: MICRO_SENTRY_CONFIG, useValue: {} },
        ],
      }).compileComponents();
      service = TestBed.inject(IssueDetailService);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show .net generated error", () => {
    service.setEvent(dotnetEvent as any);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerText).toContain(
      "/api/catalog/promoted/Testitex/featured"
    );
  });
});
