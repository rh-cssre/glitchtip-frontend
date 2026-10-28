import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from "@angular/router";
import { filter, map, startWith } from "rxjs/operators";
import { TopAppBar } from "../shared/top-app-bar/top-app-bar";

@Component({
  selector: "gt-profile",
  templateUrl: "./profile-wrapper.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet, TopAppBar],
})
export class ProfilWrapperComponent {
  private route = inject(ActivatedRoute);

  /** The open page's own title, from its route data. */
  title = toSignal(
    inject(Router).events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.route.firstChild?.snapshot?.data["title"] as string),
    ),
  );
}
