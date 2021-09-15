import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BackupCodesComponent } from "./backup-codes.component";

describe("BackupCodesComponent", () => {
  let component: BackupCodesComponent;
  let fixture: ComponentFixture<BackupCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackupCodesComponent ]
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
