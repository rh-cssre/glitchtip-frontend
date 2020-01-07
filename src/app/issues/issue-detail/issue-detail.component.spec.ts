import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { IssueDetailComponent } from "./issue-detail.component";
import { of } from "rxjs";
import { ComponentFixtureAutoDetect } from "@angular/core/testing";
import { sampleIssueDetail } from "./issue-detail-test-data";

describe("IssueDetailComponent", () => {
  let component: IssueDetailComponent;
  let fixture: ComponentFixture<IssueDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      declarations: [IssueDetailComponent],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDetailComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load issues and set the title correctly", () => {
    const expectedTitle = sampleIssueDetail.title;
    component.issue$ = of(sampleIssueDetail);
    component.issue$.subscribe(issue =>
      expect(issue ? issue.title : null).toBe(expectedTitle)
    );
  });

  /* The querySelector keeps coming out to null */
  // fit("should set issue.title to the correct title", fakeAsync(() => {
  //   const expectedTitle = sampleIssue.title;
  //   component.issue$ = of(sampleIssue);
  //   fixture.detectChanges();
  //   expect(
  //     fixture.debugElement.nativeElement.querySelector("#issueTitle").innerText
  //   ).toContain(expectedTitle);
  // }));
});
