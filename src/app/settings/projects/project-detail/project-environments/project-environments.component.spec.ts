import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEnvironmentsComponent } from './project-environments.component';

describe('ProjectEnvironmentsComponent', () => {
  let component: ProjectEnvironmentsComponent;
  let fixture: ComponentFixture<ProjectEnvironmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectEnvironmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEnvironmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
