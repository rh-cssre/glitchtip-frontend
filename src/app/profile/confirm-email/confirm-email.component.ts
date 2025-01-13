import { Component, OnInit, ChangeDetectionStrategy, inject } from "@angular/core";
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
  private activatedRoute = inject(ActivatedRoute);
  private confirmEmailService = inject(ConfirmEmailService);


  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(map((params) => this.confirmEmailService.confirmEmail(params.key)))
      .subscribe();
  }
}
