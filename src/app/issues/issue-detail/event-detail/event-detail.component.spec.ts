// tslint:disable:no-any
import { Component, Input } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { EventDetailComponent } from "./event-detail.component";
import { MaterialModule } from "src/app/shared/material.module";
import { EntryRequestComponent } from "./entry-request/entry-request.component";
import { EntryDataComponent } from "../../../shared/entry-data/entry-data.component";
import { IssueDetailService } from "../issue-detail.service";
import dotnetEvent from "./test-data/dotnet-event.json";

@Component({selector: 'gt-contexts', template: ''})
class ContextsStub {
}

@Component({selector: 'gt-entry-message', template: ''})
class EntryMessageStub {
}

@Component({selector: 'gt-entry-exception', template: ''})
class EntryExceptionStub {
  @Input() eventTitle: any;
  @Input() eventPlatform: any;
}

@Component({selector: 'gt-entry-csp', template: ''})
class EntryCspStub {
}

@Component({selector: 'gt-entry-breadcrumbs', template: ''})
class EntryBreadcrumbsStub {
}

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
          EntryCspStub,
          EntryExceptionStub,
          EntryMessageStub,
          ContextsStub,
          EntryBreadcrumbsStub,
        ],
        imports: [RouterTestingModule, HttpClientTestingModule, MaterialModule],
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
