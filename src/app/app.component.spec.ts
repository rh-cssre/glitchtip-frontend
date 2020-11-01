import { TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { MainNavModule } from "./main-nav/main-nav.module";

describe("AppComponent", () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          SharedModule,
          NoopAnimationsModule,
          HttpClientTestingModule,
          MainNavModule,
        ],
        declarations: [AppComponent],
      }).compileComponents();
    })
  );

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
