import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GlitchtipTestingModule } from "../glitchtip-testing/glitchtip-testing.module";

import { ReleasesComponent } from "./releases.component";

describe("ReleasesComponent", () => {
  let component: ReleasesComponent;
  let fixture: ComponentFixture<ReleasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlitchtipTestingModule],
      declarations: [ReleasesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
