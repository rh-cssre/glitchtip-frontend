import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { ProjectsComponent } from "./projects.component";
import { SettingsComponent } from "../settings/settings.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";

describe("ProjectsComponent", () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsComponent, SettingsComponent],
      imports: [
        MatButtonModule,
        MatCardModule,
        NoopAnimationsModule,
        RouterTestingModule,
        MatSidenavModule,
        MatListModule,
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
