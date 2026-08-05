// Type-only: declares the $localize global for the spec program. The runtime
// polyfill is already loaded by the test builder, and the app build picks the
// type up via main.ts, which the spec tsconfig does not include.
import type {} from "@angular/localize/init";
import { beforeEach, describe, it, expect } from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
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
});
