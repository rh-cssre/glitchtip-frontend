import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterTestingModule } from "@angular/router/testing";

import { AlertFormComponent } from "./alert-form.component";

describe("AlertFormComponent", () => {
  let component: AlertFormComponent;
  let fixture: ComponentFixture<AlertFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertFormComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
