import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { PanelComponent, PanelTone } from "../panel/panel.component";

let nextId = 0;

@Component({
  selector: "gt-settings-section",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, PanelComponent],
  host: {
    "[class.gt-settings-panel]": "panel()",
    "[attr.title]": "null",
  },
  // Slots are captured once, so either layout can place them: two ng-content
  // tags for one slot would fight over the same nodes.
  template: `
    <ng-template #description
      ><ng-content select="[slot=description]"
    /></ng-template>
    <ng-template #body><ng-content /></ng-template>
    <ng-template #error><ng-content select="[slot=error]" /></ng-template>
    <ng-template #actions><ng-content select="[slot=actions]" /></ng-template>
    <ng-template #headerActions
      ><ng-content select="[slot=header-actions]"
    /></ng-template>

    @if (panel()) {
      <gt-panel [tone]="tone()" [flush]="flush()">
        <div
          class="settings-section__panel-body"
          [class.settings-section__panel-body--padded]="flush()"
        >
          <div class="settings-section__head">
            <div class="settings-section__text">
              <h2
                class="settings-section__title"
                [class.cdk-visually-hidden]="hideTitle()"
                [id]="titleId"
              >
                {{ title() }}
              </h2>
              <div class="settings-section__description gt-prose">
                <ng-container [ngTemplateOutlet]="description" />
              </div>
            </div>
            <div class="settings-section__head-actions">
              <ng-container [ngTemplateOutlet]="headerActions" />
            </div>
          </div>
          @if (!flush()) {
            <div class="settings-section__body">
              <ng-container [ngTemplateOutlet]="body" />
            </div>
            <div class="settings-section__error">
              <ng-container [ngTemplateOutlet]="error" />
            </div>
          }
        </div>
        @if (flush()) {
          <div class="settings-section__flush-body">
            <ng-container [ngTemplateOutlet]="body" />
          </div>
          <div class="settings-section__error settings-section__error--padded">
            <ng-container [ngTemplateOutlet]="error" />
          </div>
        }
        <ng-container ngProjectAs="[slot=footer]"
          ><ng-container [ngTemplateOutlet]="actions"
        /></ng-container>
      </gt-panel>
    } @else {
      <div class="settings-section__text">
        <h2 class="settings-section__title" [id]="titleId">{{ title() }}</h2>
        <div class="settings-section__description gt-prose">
          <ng-container [ngTemplateOutlet]="description" />
        </div>
      </div>
      <div class="settings-section__content">
        <div class="settings-section__body">
          <ng-container [ngTemplateOutlet]="body" />
        </div>
        <div class="settings-section__error">
          <ng-container [ngTemplateOutlet]="error" />
        </div>
        <div class="settings-section__actions">
          <ng-container [ngTemplateOutlet]="actions" />
        </div>
      </div>
    }
  `,
  styleUrl: "./settings-section.component.scss",
})
export class SettingsSectionComponent {
  readonly title = input.required<string>();
  /** One bordered panel per save unit, actions in its footer. */
  readonly panel = input(false, { transform: booleanAttribute });
  /** Panel only: danger tints the border, for Delete sections. */
  readonly tone = input<PanelTone>("default");
  /** Panel only: the body runs edge to edge, for a flush gt-list with rows. */
  readonly flush = input(false, { transform: booleanAttribute });
  /** Panel only: hides a title that repeats the tab; screen readers keep it. */
  readonly hideTitle = input(false, { transform: booleanAttribute });
  readonly titleId = `gt-settings-section-${nextId++}`;
}
