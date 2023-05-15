import { NgModule } from "@angular/core";
import { ErrorStateMatcher } from "@angular/material/core";
import { LessAnnoyingErrorStateMatcher } from "./less-annoying-error-state-matcher";

@NgModule({
  providers: [
    {
      provide: ErrorStateMatcher,
      useClass: LessAnnoyingErrorStateMatcher,
    },
  ],
})
export class LessAnnoyingErrorStateMatcherModule {}
