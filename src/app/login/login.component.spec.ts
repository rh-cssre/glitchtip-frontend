import { Component, Input } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MICRO_SENTRY_CONFIG, MicroSentryService } from "@micro-sentry/angular";
import { EMPTY } from "rxjs";
import { LoginService } from "./login.service";
import { LoginComponent } from "./login.component";
import { MaterialModule } from "../shared/material.module";

@Component({ selector: "gt-form-error", template: "" })
class FormErrorStubComponent {
  @Input() error: any;
}

// Type is wrong abouit createSpyObject, third param is for properties
const authServiceSpy = (jasmine as any).createSpyObj(
  "LoginService",
  ["login"],
  { error$: EMPTY }
);

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LoginComponent, FormErrorStubComponent],
        imports: [
          NoopAnimationsModule,
          ReactiveFormsModule,
          MaterialModule,
          RouterTestingModule,
          HttpClientTestingModule,
        ],
        providers: [
          { provide: LoginService, useValue: authServiceSpy },
          MicroSentryService,
          { provide: MICRO_SENTRY_CONFIG, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should login", () => {
    authServiceSpy.login.and.returnValue(EMPTY);
    fixture.componentInstance.form.controls.email.setValue("lol@example.com");
    fixture.componentInstance.form.controls.password.setValue("hunter1234");
    const button = fixture.debugElement.nativeElement.querySelector("#submit");
    button.click();
    expect(authServiceSpy.login).toHaveBeenCalled();
  });
});
