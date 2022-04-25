import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { testTransaction } from "./transactions-test-data";
import { TransactionsAPIService } from "./transactions-api.service";

describe("TransactionsService", () => {
  let service: TransactionsAPIService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(TransactionsAPIService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should list transactions", () => {
    service
      .list("test")
      .subscribe((data) => expect(data.body).toEqual([testTransaction]));
    const req = httpTestingController.expectOne(
      "/api/0/organizations/test/transactions/"
    );
    expect(req.request.method).toEqual("GET");
    req.flush([testTransaction]);
  });
});
