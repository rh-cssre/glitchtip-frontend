import { Component, ChangeDetectionStrategy } from "@angular/core";

/**
 * Voice and tone: the central UX-writing rulebook. Per-component pages carry a
 * "Writing" block for their specific labels; this page holds the rules that
 * apply everywhere so those blocks stay short.
 */
@Component({
  selector: "preview-foundations-voice",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .vt-list {
        margin: 0;
        list-style: disc outside;
        padding-left: var(--gt-space-5);
        font: var(--mat-sys-body-medium);
      }
      .vt-list li {
        margin-bottom: var(--gt-space-2);
        padding-left: var(--gt-space-1);
      }
      .vt-swap {
        width: 100%;
        border-collapse: collapse;
        font: var(--mat-sys-body-medium);
        max-width: 640px;
      }
      .vt-swap th,
      .vt-swap td {
        text-align: left;
        vertical-align: top;
        padding: var(--gt-space-2) var(--gt-space-3);
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }
      .vt-swap th {
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface-variant);
      }
      .vt-swap td:first-child {
        color: var(--mat-sys-on-surface-variant);
        text-decoration: line-through;
        text-decoration-color: var(--mat-sys-error);
      }
    `,
  ],
  template: `
    <header class="preview-page-header">
      <h1 class="preview-page-title">Voice and tone</h1>
      <p class="preview-lead">
        How we write the words in the product. Plain, human, and calm. Each
        component page has a Writing block for its own labels; these are the
        rules underneath all of them.
      </p>
    </header>

    <div class="preview-section">
      <div class="preview-section__title">Principles</div>
      <ul class="vt-list">
        <li>Plain and human. Write like a competent colleague, not a robot or a marketer.</li>
        <li>Direct. Lead with what matters and cut words that add no information.</li>
        <li>Calm. People open a monitoring tool when something is wrong; do not add alarm or blame.</li>
      </ul>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Capitalization</div>
      <p class="preview-section__note">
        Labels are Title Case, sentences are sentence case.
      </p>
      <ul class="vt-list">
        <li>Title Case for labels: buttons, page and section titles, field labels, menu items, table headers. New Monitor, Add Project, Monitor Name.</li>
        <li>Sentence case for full sentences: helper text, error and empty-state messages, tooltips. "Enter a valid email address."</li>
        <li>Proper nouns and product names keep their own capitals.</li>
      </ul>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Terminology</div>
      <p class="preview-section__note">
        Use one word for one thing. Do not swap in synonyms because a sentence
        feels repetitive.
      </p>
      <table class="vt-swap">
        <thead>
          <tr><th>Term</th><th>Use it for</th></tr>
        </thead>
        <tbody>
          <tr><td style="text-decoration:none;color:inherit">Issue</td><td>A group of similar events, not "error group"</td></tr>
          <tr><td style="text-decoration:none;color:inherit">Event</td><td>A single occurrence of an issue</td></tr>
          <tr><td style="text-decoration:none;color:inherit">Transaction</td><td>A performance trace</td></tr>
          <tr><td style="text-decoration:none;color:inherit">Release</td><td>A tagged version of an app</td></tr>
          <tr><td style="text-decoration:none;color:inherit">Monitor</td><td>An uptime check</td></tr>
          <tr><td style="text-decoration:none;color:inherit">Organization, project, team</td><td>The account hierarchy, in that order</td></tr>
        </tbody>
      </table>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Buttons and labels</div>
      <ul class="vt-list">
        <li>Verb first, then the object: Add Monitor, Delete Project. See Buttons &amp; actions.</li>
        <li>A bare verb is fine only when the object is obvious right beside it.</li>
        <li>Match a confirm button to its action: Delete, not Yes or OK.</li>
      </ul>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Error messages</div>
      <p class="preview-section__note">
        Say what happened, then what to do. Describe the fix; never blame the
        person.
      </p>
      <table class="vt-swap">
        <thead>
          <tr><th>Instead of</th><th>Write</th></tr>
        </thead>
        <tbody>
          <tr><td>Invalid</td><td>Enter a valid email address</td></tr>
          <tr><td>Error saving</td><td>We could not save your changes. Try again.</td></tr>
          <tr><td>Request failed</td><td>Something went wrong on our end. Try again in a moment.</td></tr>
        </tbody>
      </table>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Empty states</div>
      <p class="preview-section__note">
        Say what would be here and how to fill it, in one or two lines. Point to
        the next step instead of leaving a dead end.
      </p>
      <table class="vt-swap">
        <thead>
          <tr><th>Instead of</th><th>Write</th></tr>
        </thead>
        <tbody>
          <tr><td>No data</td><td>No monitors yet. Add one to start checking uptime.</td></tr>
          <tr><td>Nothing found</td><td>No issues match these filters. Clear them to see everything.</td></tr>
        </tbody>
      </table>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">What we avoid</div>
      <ul class="vt-list">
        <li>No em or en dashes. Use a period, a comma, or a rewrite.</li>
        <li>No exclamation marks in product copy.</li>
        <li>No "please" in buttons and labels; it pads without adding meaning.</li>
        <li>No unexplained jargon. A term like DSN is fine where the user needs it, but define it the first time.</li>
      </ul>
    </div>
  `,
})
export class FoundationsVoicePreview {}
