import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MultiFactorAuthComponent } from "./multi-factor-auth.component";

describe("MultiFactorAuthComponent", () => {
  let component: MultiFactorAuthComponent;
  let fixture: ComponentFixture<MultiFactorAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiFactorAuthComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiFactorAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
