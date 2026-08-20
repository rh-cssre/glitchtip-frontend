import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatStepperModule } from "@angular/material/stepper";
import { MatButtonModule } from "@angular/material/button";
import { KeyRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * Stepper pattern: mat-stepper for a sequential, multi-step task shown one step
 * at a time (for example two-factor setup). Use it when the steps must happen in
 * order; for independent tasks, use tabs or a plain list.
 */
@Component({
  selector: "preview-stepper",
  imports: [MatStepperModule, MatButtonModule, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .step-body {
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
        margin-bottom: var(--gt-space-3);
      }
      .step-body + button,
      button + button {
        margin-right: var(--gt-space-2);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Stepper"
      status="stable"
      description="A stepper walks someone through a sequential, multi-step task one step at a time, showing where they are and what is left. Use it when the steps must happen in order, like setting up two-factor authentication. For steps that can be done in any order, use tabs or a plain list instead."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="mat-stepper gives each step a header tied to its content, announces the selected step, and moves focus with the arrow keys. Keep one clear action per step so the path forward is obvious."
      [keyboard]="keyboard"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Live example</div>
        <mat-stepper orientation="vertical" #stepper>
          <mat-step>
            <ng-template matStepLabel>Install an app</ng-template>
            <p class="step-body">One short instruction per step.</p>
            <button mat-flat-button color="primary" matStepperNext>Next</button>
          </mat-step>
          <mat-step>
            <ng-template matStepLabel>Save backup codes</ng-template>
            <p class="step-body">Only the current step's content is shown.</p>
            <button mat-stroked-button matStepperPrevious>Back</button>
            <button mat-flat-button color="primary" matStepperNext>Next</button>
          </mat-step>
          <mat-step>
            <ng-template matStepLabel>Scan and verify</ng-template>
            <p class="step-body">The last step completes the task.</p>
            <button mat-stroked-button matStepperPrevious>Back</button>
            <button mat-flat-button color="primary" (click)="stepper.reset()">
              Start over
            </button>
          </mat-step>
        </mat-stepper>
      </div>
    </preview-doc>
  `,
})
export class StepperPreview {
  readonly whenToUse = [
    "A sequential task with a clear order (a setup wizard, onboarding)",
    "When each step needs its own action and you want to show progress",
  ];
  readonly dos = [
    "One action per step, with a short step label",
    "Show only the current step's content; keep the rest collapsed",
    "Drive the step from real state so it reflects what is done",
  ];
  readonly donts = [
    "Use it for independent tasks that can be done in any order; use tabs or a list",
    "Pack several actions into one step",
    "Show every step expanded at once with no sense of where the user is",
  ];
  readonly keyboard: KeyRow[] = [
    { keys: "Up / Down", description: "Move between step headers (vertical)" },
    { keys: "Enter / Space", description: "Select the focused step" },
    { keys: "Home / End", description: "Jump to the first or last step" },
  ];
  readonly code = `<mat-stepper orientation="vertical">
  <mat-step>
    <ng-template matStepLabel>Install an app</ng-template>
    ...
    <button mat-flat-button color="primary" matStepperNext>Next</button>
  </mat-step>
  <mat-step>
    <ng-template matStepLabel>Scan and verify</ng-template>
    ...
  </mat-step>
</mat-stepper>`;
}
