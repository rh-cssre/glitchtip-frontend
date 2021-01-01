import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Transaction } from "./transactions.interfaces";
import { TransactionsService } from "./transactions.service";

const testTransaction: Transaction = {
  transaction: "/",
  timestamp: "2021-01-01T16:25:02.540670Z",
  startTimestamp: "2021-01-01T16:24:02.540670Z",
};

describe("TransactionsService", () => {
  let service: TransactionsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(TransactionsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it("should list transactions", () => {
    service
      .list("test")
      .subscribe((data) => expect(data).toEqual([testTransaction]));
    const req = httpTestingController.expectOne(
      "/api/0/organizations/test/transactions/"
    );
    expect(req.request.method).toEqual("GET");
    req.flush([testTransaction]);
  });
});
