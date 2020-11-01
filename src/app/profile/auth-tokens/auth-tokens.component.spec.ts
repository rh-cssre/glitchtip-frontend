import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuthTokensComponent } from "./auth-tokens.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

describe("AuthTokensComponent", () => {
  let component: AuthTokensComponent;
  let fixture: ComponentFixture<AuthTokensComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AuthTokensComponent],
        imports: [HttpClientTestingModule, RouterTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
