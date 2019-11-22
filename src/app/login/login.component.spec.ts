import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { RouterTestingModule } from "@angular/router/testing";
import { MatInputModule } from "@angular/material/input";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { EMPTY } from "rxjs";
import { LoginService } from "./login.service";
import { LoginComponent } from "./login.component";

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
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatCardModule,
        RouterTestingModule
      ],
      providers: [{ provide: LoginService, useValue: authServiceSpy }]
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
    fixture.componentInstance.form.controls["email"].setValue(
      "lol@example.com"
    );
    fixture.componentInstance.form.controls["password"].setValue("hunter1234");
    const button = fixture.debugElement.nativeElement.querySelector("#submit");
    button.click();
    expect(authServiceSpy.login).toHaveBeenCalled();
  });
});
