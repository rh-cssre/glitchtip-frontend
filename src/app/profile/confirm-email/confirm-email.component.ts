import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";

@Component({
  selector: "app-confirm-email",
  templateUrl: "./confirm-email.component.html",
  styleUrls: ["./confirm-email.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent implements OnInit {
  key$ = this.activatedRoute.params.pipe(
    map((params) => {
      return params.key;
    })
  );

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.key$.subscribe();
  }
}
