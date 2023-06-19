import { Component, Input } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { of } from "rxjs";
import { totpUserKey } from "./test-data";
import { TOTPComponent } from "./totp.component";

@Component({
  selector: "gt-backup-codes",
  template: "",
  standalone: true,
  imports: [HttpClientTestingModule, MatSnackBarModule, NoopAnimationsModule],
})
class BackupCodesStubComponent {
  @Input() error: any;
}

describe("TotpComponent", () => {
  let component: TOTPComponent;
  let fixture: ComponentFixture<TOTPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        TOTPComponent,
        BackupCodesStubComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TOTPComponent);
    component = fixture.componentInstance;
  });

  it("should show get started without TOTP Key", () => {
    fixture.detectChanges();
    const button: HTMLElement = fixture.nativeElement.querySelector("button");
    expect(button.innerText).toContain("Get Started");
  });

  it("should show get started with TOTP key", () => {
    component.TOTPKey$ = of(totpUserKey);
    fixture.detectChanges();
    const button: HTMLElement = fixture.nativeElement.querySelector("button");
    expect(button.innerText).toContain("Disable TOTP");
  });
});
