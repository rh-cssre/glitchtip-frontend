// tslint:disable:no-any
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { EmailService } from "./email.service";
import { sampleEmailAddressData } from "./sample-email-address-data";
import { MatSnackBarModule } from "@angular/material/snack-bar";

describe("EmailService", () => {
  let service: EmailService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EmailService);
  });

  it("should retrieve a list of email addresses", () => {
    const url = (service as any).url;
    service.retrieveEmailAddresses();
    const req = httpTestingController.expectOne(url);
    req.flush(sampleEmailAddressData);
    service.emailAddresses$.subscribe((emails) => {
      expect(emails[0].email).toEqual(sampleEmailAddressData[0].email);
    });
    const primaryIndex = sampleEmailAddressData.findIndex(
      (email) => email.isPrimary === true
    );
    service.emailAddressesSorted$.subscribe((emails) => {
      expect(emails[0].email).toEqual(
        sampleEmailAddressData[primaryIndex].email
      );
    });
  });
});
