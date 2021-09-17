import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { SharedModule } from "src/app/shared/shared.module";
import { BackupCodesComponent } from "./backup-codes.component";

describe("BackupCodesComponent", () => {
  let component: BackupCodesComponent;
  let fixture: ComponentFixture<BackupCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackupCodesComponent ],
      imports: [
        HttpClientTestingModule,
        SharedModule,
        NoopAnimationsModule,
        MatSnackBarModule
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
