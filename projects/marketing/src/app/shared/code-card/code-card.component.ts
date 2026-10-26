import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

/**
 * Reusable code card: a bordered surface with a header (filename chip + copy
 * button) and a projected code body. Use across marketing and docs for
 * paste-ready snippets.
 *
 *   <mkt-code-card filename=".env" [copyText]="dsn">
 *     <pre>...</pre>
 *   </mkt-code-card>
 */
@Component({
  selector: "mkt-code-card",
  imports: [MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="code-card">
      <div class="code-card-head">
        <span class="name">{{ filename() }}</span>
        @if (copyText()) {
          <button
            mat-icon-button
            class="copy"
            (click)="copy()"
            [attr.aria-label]="'Copy ' + (filename() || 'code')"
          >
            <mat-icon>{{ copied() ? "check" : "content_copy" }}</mat-icon>
          </button>
        }
      </div>
      <div class="code-card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrl: "./code-card.component.scss",
})
export class CodeCardComponent {
  filename = input("");
  copyText = input("");
  protected copied = signal(false);

  protected copy(): void {
    navigator.clipboard?.writeText(this.copyText()).then(
      () => this.flag(),
      () => this.flag(),
    );
  }

  private flag(): void {
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1600);
  }
}
