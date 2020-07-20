import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { EMPTY } from "rxjs";
import { LoginService } from "./login.service";
import { LoginComponent } from "./login.component";
import { MaterialModule } from "../shared/material.module";

const authServiceSpy = jasmine.createSpyObj("LoginService", ["login"]);

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: LoginService, useValue: authServiceSpy }],
    }).compileComponents();
  }));

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
