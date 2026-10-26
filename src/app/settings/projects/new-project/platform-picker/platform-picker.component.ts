import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { flattenedPlatforms } from "./platforms-for-picker";
import categoryList from "./platform-categories";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { toSignal } from "@angular/core/rxjs-interop";

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
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
  ],
})
export class PlatformPickerComponent implements ControlValueAccessor {
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
  filteredPlatforms = toSignal(
    this.filterPlatformInput.valueChanges.pipe(
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
    ),
  );

  selected = 0;
  lastSelected = 0;
  allTabIndex = this.categoryList.length;
  setSelected(index: number) {
    if (this.selected !== this.allTabIndex) {
      this.lastSelected = this.selected;
    }
    this.selected = index;
  }

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
    }
  }
  registerOnChange(fn: (platform: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
