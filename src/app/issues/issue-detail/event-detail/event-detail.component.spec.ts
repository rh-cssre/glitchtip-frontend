import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { EventDetailComponent } from "./event-detail.component";
import { MaterialModule } from "src/app/shared/material.module";
import { EntryRequestComponent } from "./entry-request/entry-request.component";
import { EntryDataComponent } from "../../../shared/entry-data/entry-data.component";
import { IssueDetailService } from "../issue-detail.service";
import dotnetEvent from "./test-data/dotnet-event.json";
import { MatomoModule } from "ngx-matomo";

describe("EventDetailComponent", () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;
  let service: IssueDetailService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EventDetailComponent,
        EntryRequestComponent,
        EntryDataComponent,
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule,
        MatomoModule,
      ],
    }).compileComponents();
    service = TestBed.inject(IssueDetailService);
  }));

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
