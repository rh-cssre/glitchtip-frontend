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
  RouterLink,
  RouterOutlet,
} from "@angular/router";
import { filter, map, startWith } from "rxjs/operators";
import { MatButtonModule } from "@angular/material/button";
import { TopAppBar } from "../shared/top-app-bar/top-app-bar";
import { BackLinkComponent } from "../shared/detail/back-link/back-link.component";

interface BarLink {
  link: readonly unknown[];
  text: string;
}

@Component({
  selector: "gt-profile",
  templateUrl: "./profile-wrapper.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    TopAppBar,
    BackLinkComponent,
  ],
})
export class ProfilWrapperComponent {
  private route = inject(ActivatedRoute);

  /** The open page's route data: title or back link, and optional action. */
  private childData = toSignal(
    inject(Router).events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.route.firstChild?.snapshot?.data),
    ),
  );
  title = computed(() => this.childData()?.["title"] as string | undefined);
  backLink = computed(
    () => this.childData()?.["backLink"] as BarLink | undefined,
  );
  action = computed(() => this.childData()?.["action"] as BarLink | undefined);
}
