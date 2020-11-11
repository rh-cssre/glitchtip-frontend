import { Component, ChangeDetectionStrategy, forwardRef } from "@angular/core";
import { flattenedPlatforms } from "./platforms-for-picker";
import categoryList from "./platform-categories";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-platform-picker",
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
})
export class PlatformPickerComponent implements ControlValueAccessor {
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
          platform.id.toLowerCase().includes(value.toLowerCase())
        );
      }
    })
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
      (platform) => platform.id === platformFromCategoryList
    );
    return platformInfo ? platformInfo.id : "other";
  }
  getPlatformName(platformFromCategoryList: string) {
    const platformInfo = this.platforms.find(
      (platform) => platform.id === platformFromCategoryList
    );
    return platformInfo ? platformInfo.name : platformFromCategoryList;
  }

  constructor() {}

  // Boilerplate for ControlValueAccessor
  onChange = (platform: string) => {};
  onTouched = () => {};
  writeValue(platform: string): void {
    if (platform === this.activePlatform) {
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
