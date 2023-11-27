import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MicroSentryModule } from "@micro-sentry/angular";

/** Convenience module for storybook and testing only */
@NgModule({
  imports: [
    CommonModule,
    HttpClientTestingModule,
    ReactiveFormsModule,
    RouterTestingModule,
    NoopAnimationsModule,
    MicroSentryModule.forRoot({}),
  ],
})
export class GlitchtipTestingModule {}
