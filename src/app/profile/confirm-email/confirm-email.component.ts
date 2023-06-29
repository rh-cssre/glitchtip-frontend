import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { ConfirmEmailService } from "../../api/confirm-email/confirm-email.service";

@Component({
  selector: "gt-confirm-email",
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ConfirmEmailComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private confirmEmailService: ConfirmEmailService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(map((params) => this.confirmEmailService.confirmEmail(params.key)))
      .subscribe();
  }
}
