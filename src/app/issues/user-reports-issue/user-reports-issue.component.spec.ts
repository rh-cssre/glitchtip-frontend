import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportsIssueComponent } from './user-reports-issue.component';

describe('UserReportsIssueComponent', () => {
  let component: UserReportsIssueComponent;
  let fixture: ComponentFixture<UserReportsIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserReportsIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReportsIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
