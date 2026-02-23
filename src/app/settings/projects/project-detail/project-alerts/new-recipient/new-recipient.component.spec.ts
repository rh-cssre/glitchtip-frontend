import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { MICRO_SENTRY_CONFIG, MicroSentryService } from "@micro-sentry/angular";

import { NewRecipientComponent } from "./new-recipient.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";

describe("NewRecipientComponent", () => {
  let component: NewRecipientComponent;
  let fixture: ComponentFixture<NewRecipientComponent>;

  const dialogMock = {
    close: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        NewRecipientComponent,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogMock },
        MicroSentryService,
        { provide: MICRO_SENTRY_CONFIG, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should validate URL regex when type webhook", () => {
    component.recipientType.setValue("webhook");
    component.url.setValue("notvalid");
    fixture.debugElement
      .query(By.css("form"))
      .triggerEventHandler("submit", null);
    fixture.detectChanges();
    expect(component.url.errors).toBeTruthy();

    component.url.setValue("https://example.com");
    fixture.detectChanges();
    expect(component.url.errors).toBeFalsy();

    component.url.setValue(
      "https://XXXXXXX.webhook.office.com/webhookb2/1f3c20aa-88db-428c-8033-8b1c71fd87c7@57d0d75c-1369-4dd3-a130-72e62ec186e4/IncomingWebhook/9d645ab454dc4e6c922ab8a95cce525f/fda473a8-4c45-458f-a19c-2bdaacf561db",
    );
    fixture.detectChanges();
    expect(component.url.errors).toBeFalsy();
  });
});
