import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  computed,
  effect,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IssueDetailService } from "../issue-detail.service";
import { SettingsService } from "src/app/api/settings.service";
import { EntryDataComponent } from "../../../shared/entry-data/entry-data.component";
import { EntryRequestComponent } from "./entry-request/entry-request.component";
import { EntryBreadcrumbsComponent } from "./entry-breadcrumbs/entry-breadcrumbs.component";
import { EntryCSPComponent } from "./entry-csp/entry-csp.component";
import { EntryExceptionComponent } from "./entry-exception/entry-exception.component";
import { EntryMessageComponent } from "./entry-message/entry-message.component";
import { ContextsComponent } from "./context/contexts.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe, KeyValuePipe } from "@angular/common";

/** localStorage flag: the one-time "connect your agent via MCP" tip has been shown. */
const MCP_COPY_HINT_SEEN_KEY = "mcpCopyHintSeen";

@Component({
  selector: "gt-event-detail",
  templateUrl: "./event-detail.component.html",
  styleUrls: ["./event-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterLink,
    ClipboardModule,
    MatIconModule,
    MatDividerModule,
    ContextsComponent,
    EntryMessageComponent,
    EntryExceptionComponent,
    EntryCSPComponent,
    EntryBreadcrumbsComponent,
    EntryRequestComponent,
    EntryDataComponent,
    DatePipe,
    KeyValuePipe,
  ],
})
export class EventDetailComponent {
  private issueService = inject(IssueDetailService);
  private settingsService = inject(SettingsService);
  private snackBar = inject(MatSnackBar);
  orgSlug = input.required<string>({ alias: "org-slug" });
  issueID = input.required<string>({ alias: "issue-id" });
  eventID = input<string | null>(null, { alias: "event-id" });
  query = input<string | null>(null);

  event = this.issueService.event;

  /**
   * Whether the MCP feature is available on this instance. Gates the post-copy
   * hint ONLY — the "copy for AI" button works regardless. Reuses the already
   * loaded settings, no extra fetch.
   */
  mcpEnabled = computed(() =>
    this.settingsService.enabledFeatures().includes("mcp"),
  );

  /** Frontend-only dismiss flag for the one-time MCP hint. */
  private mcpHintSeen = signal(
    localStorage.getItem(MCP_COPY_HINT_SEEN_KEY) === "true",
  );

  /**
   * The event as a payload tuned for pasting into an LLM agent: a marker that
   * this is a GlitchTip error event, the identifiers shown on the page, the
   * instance origin and a link back to this event, then the raw event JSON.
   *
   * Light metadata only — deliberately NO pre-written prompt/ask. The added
   * context makes the plain paste-into-a-chatbot path work better on its own.
   */
  aiPayload = computed(() => {
    const event = this.event();
    if (!event) {
      return "";
    }
    const origin = window.location.origin;
    const lines = [
      "GlitchTip error event",
      `Source: ${this.settingsService.instanceName() || origin}`,
      `Instance: ${origin}`,
      `Organization: ${this.orgSlug()}`,
      `Issue ID: ${this.issueID()}`,
      `Event ID: ${event.id}`,
      `Event URL: ${window.location.href}`,
      "",
      "Raw event JSON:",
      "```json",
      JSON.stringify(event, null, 2),
      "```",
    ];
    return lines.join("\n");
  });
  contexts = computed(() => this.event()?.contexts as { [key: string]: any });
  initialLoadComplete = this.issueService.eventInitialLoadComplete;
  nextEvent = this.issueService.hasNextEvent;
  previousEvent = this.issueService.hasPreviousEvent;
  nextEventUrl = this.issueService.nextEventUrl;
  previousEventUrl = this.issueService.previousEventUrl;

  constructor() {
    effect(() => {
      this.issueService.eventID.set(this.eventID());
    });
  }

  /** TODO fix these types */
  generateQuery(tag: { [key: string]: string | null }) {
    // Assume unresolved if not present; tag overrides query otherwise
    const unresolved = this.query() === undefined ? "is:unresolved " : "";

    if (tag.key === "environment") {
      return { environment: tag.value };
    } else {
      return { query: `${unresolved}"${tag.key}":"${tag.value}"` };
    }
  }

  /**
   * Fired after the "copy for AI" payload lands on the clipboard. Always
   * confirms the copy. When MCP is enabled on this instance and the one-time
   * tip hasn't been shown yet, the confirmation also nudges the user toward
   * connecting their agent live via MCP (instead of pasting), then marks the
   * tip as seen so it never nags again.
   */
  onCopiedForAI() {
    if (this.mcpEnabled() && !this.mcpHintSeen()) {
      this.mcpHintSeen.set(true);
      localStorage.setItem(MCP_COPY_HINT_SEEN_KEY, "true");
      const ref = this.snackBar.open(
        $localize`Copied. You can also connect your agent directly via MCP to pull this event, its related logs, and traces live instead of pasting.`,
        $localize`Set up MCP`,
        { duration: 12000 },
      );
      // Pass this instance's origin in the URL fragment (not a query param) so
      // the docs can pre-fill the setup examples. Fragments stay client-side
      // and aren't sent to glitchtip.com, so a self-hoster's domain isn't
      // logged there.
      const docsUrl =
        "https://glitchtip.com/documentation/mcp#instance=" +
        encodeURIComponent(window.location.origin);
      ref
        .onAction()
        .subscribe(() => window.open(docsUrl, "_blank", "noopener"));
    } else {
      this.snackBar.open($localize`Copied for AI`);
    }
  }

  /**
   * Check if a string is a valid URL
   */
  isValidUrl(value: string | null): boolean {
    if (!value) return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
}
