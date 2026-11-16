import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  input,
  computed,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "src/app/auth.service";
import { AcceptInviteService } from "./accept-invite.service";
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { AuthBrandComponent } from "src/app/shared/auth-brand/auth-brand.component";

@Component({
  selector: "gt-accept-invite",
  templateUrl: "./accept-invite.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, RouterLink, PanelComponent, AuthBrandComponent],
})
export class AcceptInviteComponent implements OnInit {
  #authService = inject(AuthService);
  #acceptService = inject(AcceptInviteService);
  memberId = input.required<number>();
  token = input<string>("");
  nextUrl = computed(() => `/accept/${this.memberId()}/${this.token()}`);

  isLoggedIn = this.#authService.isAuthenticated;
  acceptInfo = this.#acceptService.acceptInfo;
  alreadyInOrg = this.#acceptService.alreadyInOrg;

  ngOnInit(): void {
    this.#acceptService.setParams(this.memberId(), this.token());
  }

  onSubmit() {
    this.#acceptService.acceptInvite(this.memberId(), this.token());
  }

  logout() {
    this.#authService.logout();
  }
}
