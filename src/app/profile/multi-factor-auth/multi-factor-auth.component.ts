import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MultiFactorAuthService } from "./multi-factor-auth.service";

@Component({
  selector: "gt-multi-factor-auth",
  templateUrl: "./multi-factor-auth.component.html",
  styleUrls: ["./multi-factor-auth.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiFactorAuthComponent implements OnInit {
  initialLoad$ = this.service.initialLoad$;
  constructor(private service: MultiFactorAuthService) {}

  ngOnInit() {
    this.service.getUserKeys().subscribe();
  }
}
