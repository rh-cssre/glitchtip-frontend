import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AuthTokensComponent } from "./auth-tokens.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("AuthTokensComponent", () => {
  let component: AuthTokensComponent;
  let fixture: ComponentFixture<AuthTokensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthTokensComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
