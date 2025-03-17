import { HttpClient } from "@angular/common/http";
import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EMPTY } from "rxjs";
import { catchError, exhaustMap, map, tap } from "rxjs/operators";
import { baseUrl } from "src/app/constants";

@Component({
  selector: "gt-wizard",
  templateUrl: "./wizard.component.html",
  styleUrls: ["./wizard.component.scss"],
  standalone: true,
})
export class WizardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  message = "Connecting to @sentry/wizard...";

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((data) => data.get("hash")),
        exhaustMap((hash) =>
          this.http
            .post(baseUrl + "/wizard-set-token/", {
              hash,
            })
            .pipe(
              tap(
                () =>
                  (this.message = "Successfully connected to @sentry/wizard."),
              ),
            ),
        ),
        catchError(() => {
          this.message = "Unable to connect to @sentry/wizard";
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
