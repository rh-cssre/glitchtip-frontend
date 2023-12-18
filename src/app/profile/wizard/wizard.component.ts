import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
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
  message = "Connecting to @sentry/wizard...";
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

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
                  (this.message = "Successfully connected to @sentry/wizard.")
              )
            )
        ),
        catchError(() => {
          this.message = "Unable to connect to @sentry/wizard";
          return EMPTY;
        })
      )
      .subscribe();
  }
}
