import { Component, Input } from "@angular/core";

@Component({
  standalone: true,
  imports: [],
  selector: "mkt-question-and-answer",
  templateUrl: "./question-and-answer.component.html",
  styleUrls: ["./question-and-answer.component.scss"],
})
export class QuestionAndAnswerComponent {
  @Input() question: string | undefined;
  /**
   * If your answer is one paragraph of plaintext, use this. Otherwise, use
   * arbitrary HTML with children:
   *
   * ```
   * <mkt-question-and-answer
   *    question="How do I use children if the answer Input isn't enough?"
   * >
   *    <p>Answer: like this. <a href="https://glitchtip.com">whee</a></p>
   * </mkt-question-and-answer>
   * ```
   */
  @Input() answer: string | undefined;

  constructor() {}
}
