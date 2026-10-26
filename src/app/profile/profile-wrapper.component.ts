import {
  Component,
  computed,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from "@angular/router";
import { filter, map, startWith } from "rxjs/operators";
import { UserService } from "../api/user/user.service";
import { TopAppBar } from "../shared/top-app-bar/top-app-bar";
import { BackLinkComponent } from "../shared/detail/back-link/back-link.component";

@Component({
  selector: "gt-profile",
  templateUrl: "./profile-wrapper.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet, TopAppBar, BackLinkComponent],
})
export class ProfilWrapperComponent {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  user = this.userService.user;
  /** The open page's route data: its title, or a back link for sub-pages. */
  private childData = toSignal(
    inject(Router).events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.route.firstChild?.snapshot.data),
    ),
  );
  title = computed(() => this.childData()?.["title"] as string | undefined);
  backLink = computed(
    () =>
      this.childData()?.["backLink"] as
        | { link: readonly unknown[]; text: string }
        | undefined,
  );
}
