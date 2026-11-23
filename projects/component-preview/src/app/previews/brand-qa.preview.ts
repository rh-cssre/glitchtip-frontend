import { Component, ChangeDetectionStrategy } from "@angular/core";
import { QuestionAndAnswerComponent } from "projects/marketing/src/app/shared/payment/question-and-answer/question-and-answer.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-brand-qa",
  imports: [QuestionAndAnswerComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      dl {
        max-width: 560px;
        margin: 0;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Question & answer"
      status="stable"
      description="One FAQ entry: a question as the term and its answer as the definition. Pass a plain-text answer, or omit it and project rich HTML for a longer answer with links."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="Renders a dt/dd pair so a screen reader announces the question then its answer. Wrap a set of them in a dl."
      [api]="api"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">FAQ list</div>
        <dl>
          <mkt-question-and-answer
            question="Do you offer a free plan?"
            answer="Yes. The free plan covers 1,000 events a month, no card required."
          />
          <mkt-question-and-answer
            question="Can I self-host GlitchTip?"
            answer="Yes. GlitchTip is open source and runs on your own infrastructure."
          />
        </dl>
      </div>
    </preview-doc>
  `,
})
export class BrandQaPreview {
  readonly whenToUse = [
    "FAQ and support sections on marketing pages",
    "Any term/definition pair on a brand surface",
  ];
  readonly dos = [
    "Phrase the question the way a visitor would ask it",
    "Keep answers short; link out for the detail",
    "Wrap a set of them in a dl",
  ];
  readonly donts = [
    "Put a whole article in one answer",
  ];
  readonly content = [
    "The question is a real question, ending in a question mark",
    "Answer in plain sentences (sentence case), not marketing headline case",
  ];
  readonly api: ApiRow[] = [
    { name: "question", type: "string", default: "", description: "The question, shown as the dt" },
    { name: "answer", type: "string", default: "", description: "Plain-text answer; omit to project HTML into the dd instead" },
  ];
  readonly code = `<dl>
  <mkt-question-and-answer
    question="Do you offer a free plan?"
    answer="Yes. The free plan covers 1,000 events a month."
  />
  <!-- rich answer: omit [answer] and project HTML -->
  <mkt-question-and-answer question="How do I start?">
    <p>Install the SDK and <a href="/docs">follow the guide</a>.</p>
  </mkt-question-and-answer>
</dl>`;
}
