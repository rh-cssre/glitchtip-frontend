import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { moduleMetadata } from "@storybook/angular";

export default {
  decorators: [
    moduleMetadata({
      imports: [MatIconModule, MatDividerModule],
    }),
  ],
  title: "Styles/General Styling",
};

export const Typography = () => ({
  template: `
  <section>
    <article class="mat-typography">
      <h1>Angular Material typography</h1>
      <p><a href="https://m3.material.io/styles/typography/type-scale-tokens">Reference</a></p>
      <p>We use a small number of custom classes for text in the app</p>
    </article>
    <mat-divider></mat-divider>

    <p class="mat-title-medium">
      section-header-text: Primarily used for page titles
    </p>
    <p class="section-header-text">The quick brown fox jumps over the lazy dog</p>

    <mat-divider></mat-divider>

    <p class="mat-title-medium">
      section-header-text-light: non-bold variant for issue titles
    </p>
    <p class="section-header-text-light">The quick brown fox jumps over the lazy dog</p>

    <mat-divider></mat-divider>

    <p class="mat-title-medium">
      body-text: default style for longer text blocks
    </p>
    <p class="body-text">The quick brown fox jumps over the lazy dog</p>

    <mat-divider></mat-divider>

    <p class="mat-title-medium">
      body-text-strong: bold variant
    </p>
    <p class="body-text-strong">The quick brown fox jumps over the lazy dog</p>

    <mat-divider></mat-divider>

    <p class="mat-title-medium">
      caption-text: small
    </p>
    <p class="caption-text">The quick brown fox jumps over the lazy dog</p>

    <mat-divider></mat-divider>

  </section>
  `,
});

const iconNames = [
  "account_circle",
  "add",
  "arrow_drop_down",
  "arrow_right",
  "brightness_medium",
  "check_box",
  "check_circle",
  "close",
  "code",
  "computer",
  "dark_mode",
  "delete",
  "devices_other",
  "done",
  "done_outline",
  "edit",
  "email",
  "error",
  "exclamation",
  "favorite",
  "file_copy",
  "filter_list",
  "help",
  "keyboard_arrow_down",
  "keyboard_arrow_left",
  "keyboard_arrow_right",
  "keyboard_arrow_up",
  "light_mode",
  "menu",
  "more",
  "more_vert",
  "more_horiz",
  "notifications_off",
  "open_in_new",
  "priority_high",
  "settings",
  "tab",
  "volume_off",
  "warning",
];
const iconURL = `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD&#64;20..48,100..700,0..1,-50..200&icon_names=${iconNames.join(
  ",",
)}`;
export const Icons = () => ({
  template: `
  <section class="mat-typography">
    <h1>Icons</h1>

    We use Material Symbols with Angular Material. Icons default to the 'filled' style.
    Add "material-icons-outlined" to a mat-icon's classes for 'outlined' style:

    <h2>Filled</h2>
    <div class="icon-grid">
      ${iconNames
        .map(
          (icon) => `
        <div class="icon-container">
          <mat-icon>${icon}</mat-icon>
          <span class="icon-name">${icon}</span>
        </div>
      `,
        )
        .join("")}
    </div>
    <h2>Outlined</h2>
    <div class="icon-grid">
      ${iconNames
        .map(
          (icon) => `
        <div class="icon-container">
          <mat-icon class="material-symbols-outlined">${icon}</mat-icon>
          <span class="icon-name">${icon}</span>
        </div>
      `,
        )
        .join("")}
    </div>
    <mat-divider></mat-divider>
    We self host a minimal set of symbol fonts. To add more, add to this stories list, then download from <a href="${iconURL}">fonts.googleapis.com</a> and copy to src/assets/fonts/.
  </section>

  <br/>
  <section class="mat-typography">
    <h1>Custom Icons</h1>
    <p>In addition to Angular's icons, we have added custom ones in 'index.html'</p>
    <div style="display: flex; align-items: center; margin: 16px">
      <div>#github:</div>
      <svg style="width: 32px; height: 32px; margin-left: 8px; margin-right: 32px"><use xlink:href="#github"></use></svg>
      <div>#gitlab:</div>
      <svg style="width: 32px; height: 32px; margin-left: 8px; margin-right: 32px"><use xlink:href="#gitlab"></use></svg>
      <div>#google:</div>
      <svg style="width: 32px; height: 32px; margin-left: 8px; margin-right: 32px"><use xlink:href="#google"></use></svg>
      <div>#microsoft:</div>
      <svg style="width: 32px; height: 32px; margin-left: 8px; margin-right: 32px"><use xlink:href="#microsoft"></use></svg>
    </div>
  </section>
  `,
  styles: [
    `
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 20px;
    }
    .icon-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .icon-name {
      font-size: 12px;
      margin-top: 5px;
    }
  `,
  ],
});

export const Colors = () => ({
  template: `
  <section class="mat-typography">
    <p class="section-header-text-light">Sometimes you will want to customize the colors you are using. For this, refer to $amaranth-palette in _variables.scss</p>
    <p>Use mat-color($amaranth-palette, 50) to get a color from the palette: <a href="https://v5.material.angular.io/guide/theming-your-components#using-colors-from-a-palette" target="_blank">Material Reference</a></p>
    <div style="width: 100%; height: 100px; background-color: #fce8ed"></div>
    <p style="margin-top: 50px">Use mat-contrast($amaranth-palette, 50) to get the contrasting color:</p>
    <div style="width: 100%; height: 100px; background-color: #000000"></div>
    <p style="margin-top: 50px">To use a gray color, use mat-color($mat-gray, 500): <a target="_blank" href="https://material.io/design/color/the-color-system.html#tools-for-picking-colors">Material Reference</a></p>
    <div style="width: 100%; height: 100px; background-color: #9E9E9E"></div>
  </section>
  `,
});
