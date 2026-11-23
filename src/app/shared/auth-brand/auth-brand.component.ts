import { ChangeDetectionStrategy, Component } from "@angular/core";

/**
 * The left pane on logged-out pages: the G mark, one two-tone statement on a faded,
 * slowly drifting patch of grid. Hidden on narrow screens.
 */
@Component({
  selector: "gt-auth-brand",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "auth-brand", "aria-hidden": "true" },
  template: `
    <img
      class="auth-brand__logo"
      src="static/assets/images/glitchtip-logo-collasped.svg"
      alt=""
    />
    <div class="auth-brand__copy">
      <div class="auth-brand__grid">
        <div class="auth-brand__lines">
          <i class="auth-brand__ping"></i>
          <i class="auth-brand__ping"></i>
          <i class="auth-brand__ping"></i>
          <i class="auth-brand__ping"></i>
          <i class="auth-brand__ping"></i>
          <i class="auth-brand__ping"></i>
          <i class="auth-brand__ping"></i>
        </div>
      </div>
      <p class="auth-brand__statement">
        <strong><ng-content select="[slot=lead]" /></strong>
        <ng-content select="[slot=rest]" />
      </p>
    </div>
  `,
})
export class AuthBrandComponent {}
