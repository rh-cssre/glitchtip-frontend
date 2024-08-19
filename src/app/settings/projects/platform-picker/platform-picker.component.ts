import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import {
  MatExpansionPanel,
  MatExpansionModule,
} from "@angular/material/expansion";
import { flattenedPlatforms } from "./platforms-for-picker";
import categoryList from "./platform-categories";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "gt-platform-picker",
  templateUrl: "./platform-picker.component.html",
  styleUrls: ["./platform-picker.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PlatformPickerComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatExpansionModule,
    MatListModule,
    AsyncPipe,
  ],
})
export class PlatformPickerComponent implements ControlValueAccessor {
  @Input() template: "buttons" | "dropdown" = "buttons";

  @ViewChild("expansionPanel", { static: false })
  expansionPanel?: MatExpansionPanel;

  @ViewChild("filterInput", { static: false })
  filterInput?: ElementRef<HTMLInputElement>;

  platforms = flattenedPlatforms.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  activePlatform = "";
  categoryList = categoryList;

  /** Used to filter project names */
  filterPlatformInput = new FormControl();

  /** Projects that are filtered via the text field form control */
  filteredPlatforms$ = this.filterPlatformInput.valueChanges.pipe(
    startWith(""),
    map((value) => {
      if (value === "") {
        this.setSelected(this.lastSelected);
        return this.platforms;
      } else {
        this.setSelected(this.allTabIndex);
        return this.platforms.filter((platform) =>
          platform.id.toLowerCase().includes(value.toLowerCase()),
        );
      }
    }),
  );

  selected = 0;
  lastSelected = 0;
  allTabIndex = this.categoryList.length;
  setSelected = (index: number) => {
    if (this.selected !== this.allTabIndex) {
      this.lastSelected = this.selected;
    }
    this.selected = index;
  };

  getPlatformId(platformFromCategoryList: string) {
    const platformInfo = this.platforms.find(
      (platform) => platform.id === platformFromCategoryList,
    );
    return platformInfo ? platformInfo.id : "other";
  }

  getPlatformName(platformFromCategoryList: string) {
    const platformInfo = this.platforms.find(
      (platform) => platform.id === platformFromCategoryList,
    );
    return platformInfo ? platformInfo.name : platformFromCategoryList;
  }

  constructor() {}

  // Boilerplate for ControlValueAccessor
  onChange = (platform: string) => {};
  onTouched = () => {};
  /**
   * @param toggle Added to boilerplate writeValue because one version of
   * platform picker uses buttons and they need to be toggle-able. False by
   * default because Angular doesn't expect it to be there
   */
  writeValue(platform: string, toggle = false): void {
    if (platform === this.activePlatform && toggle) {
      this.activePlatform = "";
      this.onChange("");
    } else {
      this.activePlatform = platform;
      this.onChange(platform);
      if (this.expansionPanel?.expanded) {
        this.expansionPanel.close();
      }
    }
  }
  registerOnChange(fn: (platform: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  focusPanel() {
    this.filterInput?.nativeElement.focus();
  }

  @HostListener("document:keydown", ["$event"]) onKeydownHandler(
    event: KeyboardEvent,
  ) {
    if (this.expansionPanel?.expanded) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        this.moveDown();
      }
      if (event.key === "ArrowUp") {
        this.moveUp();
      }
    }
  }

  moveDown() {
    const projectButtons = Array.from(
      document.querySelectorAll(".picker-button"),
    ) as HTMLElement[];
    // If the text box is focused, go to the first item
    if (this.filterInput?.nativeElement.id === document.activeElement?.id) {
      projectButtons[0]?.focus();
    } else {
      const indexOfActive = projectButtons.findIndex(
        (button) => button.id === document.activeElement?.id,
      );
      if (indexOfActive <= projectButtons.length - 2) {
        // If we're in the list items, go to the next list item
        projectButtons[indexOfActive + 1].focus();
      } else {
        // If we're in the last list item, go to the first item
        projectButtons[0].focus();
      }
    }
  }

  moveUp() {
    const projectButtons = Array.from(
      document.querySelectorAll(".picker-button"),
    ) as HTMLElement[];
    const indexOfActive = projectButtons.findIndex(
      (button) => button.id === document.activeElement?.id,
    );
    if (indexOfActive > 0) {
      // If we're in the list items, go to the previous list item
      projectButtons[indexOfActive - 1].focus();
    } else {
      // If we're in the first list item, go to the first item
      this.filterInput?.nativeElement.focus();
    }
  }
}
