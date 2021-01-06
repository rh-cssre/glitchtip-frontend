import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { testTransaction } from "../api/transactions/transactions-test-data";
import { SharedModule } from "../shared/shared.module";
import { PerformanceComponent } from "./performance.component";

describe("PerformanceComponent", () => {
  let organizationsServiceStub: Partial<OrganizationsService>;
  let fixture: ComponentFixture<PerformanceComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    organizationsServiceStub = {
      activeOrganizationSlug$: of("test"),
    };
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule],
      providers: [
        { provide: OrganizationsService, useValue: organizationsServiceStub },
      ],
      declarations: [PerformanceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PerformanceComponent);
    fixture.detectChanges();
  });

  it("should fetch and show transactions on init", () => {
    const req = httpTestingController.expectOne(
      "/api/0/organizations/test/transactions/"
    );
    expect(req.request.method).toEqual("GET");
    req.flush([testTransaction]);
    fixture.detectChanges();
    const section = fixture.nativeElement.querySelector("section");
    expect(section.innerHTML).toContain(testTransaction.transaction);
  });
});
