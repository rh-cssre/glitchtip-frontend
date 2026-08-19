// Type-only: declares the $localize global for the spec program. The runtime
// polyfill is already loaded by the test builder, and the app build picks the
// type up via main.ts, which the spec tsconfig does not include.
import type {} from "@angular/localize/init";
import { beforeEach, describe, it, expect } from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AlertFormComponent } from "./alert-form.component";

describe("AlertFormComponent environments", () => {
  let fixture: ComponentFixture<AlertFormComponent>;
  let component: AlertFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertFormComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AlertFormComponent);
    component = fixture.componentInstance;
  });

  function setInputs(environments: string[], available: string[]) {
    fixture.componentRef.setInput("timespan", 10);
    fixture.componentRef.setInput("quantity", 2);
    fixture.componentRef.setInput("environments", environments);
    fixture.componentRef.setInput("availableEnvironments", available);
    fixture.detectChanges();
  }

  it("still applies the other settings when the API omits environments", () => {
    // A backend without the environments field returns undefined for it. The
    // form must not blow up, or it never applies quantity/timespan/uptime.
    fixture.componentRef.setInput("timespan", 10);
    fixture.componentRef.setInput("quantity", 2);
    fixture.componentRef.setInput("uptime", true);
    fixture.componentRef.setInput("environments", undefined);
    fixture.componentRef.setInput("availableEnvironments", undefined);
    fixture.detectChanges();

    expect(component.projectFormQuantity.value).toEqual("2");
    expect(component.projectFormTimespan.value).toEqual("10");
    expect(component.projectFormUptime.value).toBe(true);
    expect(component.projectFormEnvironments.value).toEqual([]);
    expect(component.environmentOptions()).toEqual([]);
    expect(component.environmentsUnchanged()).toBe(true);
  });

  it("offers the project's environments as options", () => {
    setInputs([], ["production", "staging"]);
    expect(component.environmentOptions()).toEqual(["production", "staging"]);
  });

  it("keeps a selected environment the project no longer reports", () => {
    setInputs(["legacy"], ["production"]);
    expect(component.environmentOptions()).toEqual(["production", "legacy"]);
  });

  it("does not duplicate an environment that is both selected and available", () => {
    setInputs(["production"], ["production", "staging"]);
    expect(component.environmentOptions()).toEqual(["production", "staging"]);
  });

  it("seeds the form with the alert's current environments", () => {
    setInputs(["production"], ["production", "staging"]);
    expect(component.projectFormEnvironments.value).toEqual(["production"]);
  });

  it("emits the selected environments on submit", () => {
    setInputs([], ["production", "staging"]);
    let emitted: string[] | undefined;
    component.alertSubmit.subscribe((event) => {
      emitted = event.environments;
    });
    component.projectFormEnvironments.setValue(["staging"]);
    component.onSubmit();
    expect(emitted).toEqual(["staging"]);
  });

  it("reports environments as unchanged regardless of selection order", () => {
    setInputs(["production", "staging"], ["production", "staging"]);
    expect(component.environmentsUnchanged()).toBe(true);

    component.projectFormEnvironments.setValue(["staging", "production"]);
    expect(component.environmentsUnchanged()).toBe(true);

    component.projectFormEnvironments.setValue(["staging"]);
    expect(component.environmentsUnchanged()).toBe(false);
  });

  it("renders the environments select wired to the form control", () => {
    // Class-only tests stay green on a broken template; assert real render + wiring.
    setInputs(["production"], ["production", "staging"]);
    const select = fixture.debugElement.query(
      By.css('[data-cy="environments"]'),
    );
    expect(select).toBeTruthy();
    expect(select.componentInstance.value).toEqual(["production"]);
  });

  it("scopes the whole alert rather than the event condition", () => {
    // Nesting the field under the event line would read as if uptime
    // notifications ignore it, which they do not.
    setInputs([], ["production", "staging"]);
    const eventLine = fixture.debugElement.query(By.css(".trigger__line"));
    expect(eventLine.query(By.css('[data-cy="environments"]'))).toBeNull();
    expect(
      fixture.debugElement.query(By.css('[data-cy="environments"]')),
    ).toBeTruthy();
  });

  it("hides the environments field when the project has none", () => {
    setInputs([], []);
    expect(
      fixture.debugElement.query(By.css('[data-cy="environments"]')),
    ).toBeNull();
  });

  it("emits an empty array (applies to all environments) when none selected", () => {
    setInputs([], ["production", "staging"]);
    let emitted: string[] | undefined;
    component.alertSubmit.subscribe((event) => {
      emitted = event.environments;
    });
    component.onSubmit();
    expect(emitted).toEqual([]);
  });
});
