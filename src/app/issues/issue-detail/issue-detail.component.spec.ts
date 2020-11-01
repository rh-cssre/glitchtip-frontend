import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { IssueDetailComponent } from "./issue-detail.component";
import { ComponentFixtureAutoDetect } from "@angular/core/testing";
import { SharedModule } from "src/app/shared/shared.module";

describe("IssueDetailComponent", () => {
  let component: IssueDetailComponent;
  let fixture: ComponentFixture<IssueDetailComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
          NoopAnimationsModule,
          SharedModule,
        ],
        declarations: [IssueDetailComponent],
        providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDetailComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
