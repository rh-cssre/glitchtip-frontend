import { computed, Injectable, signal, inject } from "@angular/core";
import { Router } from "@angular/router";
import { fromEvent } from "rxjs";
import { debounceTime, tap } from "rxjs/operators";

interface MainNavState {
  navOpen: boolean;
  mobileNav: boolean | null;
}

const initialState: MainNavState = {
  navOpen: true,
  mobileNav: null,
};

@Injectable({
  providedIn: "root",
})
export class MainNavService {
  private router = inject(Router);

  private readonly state = signal<MainNavState>(initialState);

  // Use computed signals for derived state
  readonly navOpen = computed(() => this.state().navOpen);
  readonly mobileNav = computed(() => this.state().mobileNav);

  constructor() {
    const tabletSize = 768; // same as $tablet for scss

    if (window.innerWidth < tabletSize) {
      this.mobileNavSettings();
    } else {
      this.desktopNavSettings();
    }

    this.router.events.subscribe((_) => {
      if (window.innerWidth < tabletSize) {
        this.setCloseNav();
      }
    });

    fromEvent(window, "resize")
      .pipe(
        debounceTime(100),
        tap((_) => {
          if (window.innerWidth < tabletSize) {
            this.mobileNavSettings();
          } else {
            this.desktopNavSettings();
          }
        }),
      )
      .subscribe();
  }

  mobileNavSettings() {
    this.setMobileNav(true);
    this.setCloseNav();
  }

  desktopNavSettings() {
    this.setMobileNav(false);
    this.setOpenNav();
  }

  getToggleNav() {
    this.setToggleNav();
  }

  getClosedNav() {
    this.setCloseNav();
  }

  private setMobileNav(isMobile: boolean) {
    this.state.update((state) => ({ ...state, mobileNav: isMobile }));
  }

  private setCloseNav() {
    this.state.update((state) => ({ ...state, navOpen: false }));
  }

  private setOpenNav() {
    this.state.update((state) => ({ ...state, navOpen: true }));
  }

  private setToggleNav() {
    this.state.update((state) => ({ ...state, navOpen: !state.navOpen }));
  }
}
