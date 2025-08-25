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
      <p><a href="https://material.angular.io/guide/typography">Reference</a></p>
      <p>This section is wrapped with class "mat-typography"</p>
      <p>You can also cutomize with specific classes, as displayed below</p>
    </article>

    <mat-divider></mat-divider>

    <p class="mat-h4 mat-subheading-1">
      mat-headline-1: Large, one-off header, usually at the top of the page (e.g.
      a hero header).
    </p>
    <p class="mat-headline-1">The quick brown fox jumps over the lazy dog</p>

    <mat-divider></mat-divider>

    <p class="mat-h4 mat-subheading-1">
      mat-headline-2: Large, one-off header, usually at the top of the page (e.g.
      a hero header).
    </p>
    <p class="mat-headline-2">The quick brown fox jumps over the lazy dog</p>

    <mat-divider></mat-divider>

    <p class="mat-h4 mat-subheading-1">
    mat-headline-3: Large, one-off header, usually at the top of the page (e.g.
    a hero header).
    </p>
    <p class="mat-headline-3">The quick brown fox jumps over the lazy dog</p>

    <mat-divider></mat-divider>

    <p class="mat-h4 mat-subheading-1">
    mat-headline-4: Large, one-off header, usually at the top of the page (e.g.
    a hero header).
    </p>
    <p class="mat-headline-4">The quick brown fox jumps over the lazy dog</p>

    <mat-divider></mat-divider>

    <p class="mat-h4 mat-subheading-1">
    mat-h1 OR mat-headline: Section heading corresponding to the h1 tag.
    </p>
    <h1 class="mat-h1 mat-headline">The quick brown fox jumps over the lazy dog</h1>

    <mat-divider></mat-divider>

    <p class="mat-h4 mat-subheading-1">
    mat-h2 OR mat-title: Section heading corresponding to the h2 tag.
    </p>
    <h2 class="mat-h2 mat-title">The quick brown fox jumps over the lazy dog</h2>

    <mat-divider></mat-divider>

    <p class="mat-h4 mat-subheading-1">
    mat-h3 OR mat-subheading-2: Section heading corresponding to the h3 tag.
    </p>
    <h3 class="mat-h3 mat-subheading-2">The quick brown fox jumps over the lazy dog</h3>

    <mat-divider></mat-divider>

    <p class="mat-h4 mat-subheading-1">
    mat-h4 OR mat-subheading-1: Section heading corresponding to the h4 tag.
    </p>
    <h4 class="mat-h4 mat-subheading-1">The quick brown fox jumps over the lazy dog</h4>

    <mat-divider></mat-divider>

    <p class="mat-h4 mat-subheading-1">
    mat-body OR mat-body-1: Base body text.
    </p>
    <p class="mat-body mat-body-1">The quick brown fox jumps over the lazy dog</p>

    <mat-divider></mat-divider>

    <p class="mat-h4 mat-subheading-1">
    mat-body-strong: Bolder body text.
    </p>
    <p class="mat-body-strong">The quick brown fox jumps over the lazy dog</p>

    <mat-divider></mat-divider>

    <p class="mat-h4 mat-subheading-1">
    mat-small OR mat-caption: Smaller body and hint text.
    </p>
    <p class="mat-small mat-caption">The quick brown fox jumps over the lazy dog</p>

    <mat-divider></mat-divider>
  </section>
  `,
});

const iconNames = [
  "account_circle",
  "add",
  "brightness_medium",
  "check_box",
  "check_circle",
  "close",
  "code",
  "computer",
  "dark_mode",
  "delete",
  "delete_outline",
  "devices_other",
  "done",
  "edit",
  "email",
  "favorite",
  "file_copy",
  "help",
  "keyboard_arrow_down",
  "keyboard_arrow_left",
  "keyboard_arrow_right",
  "keyboard_arrow_up",
  "light_mode",
  "menu",
  "more_horiz",
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

    We use Material Symbols with Angular Material. Here are the icons we use:

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
    <p class="mat-h1">Sometimes you will want to customize the colors you are using. For this, refer to $amaranth-palette in _variables.scss</p>
    <p>Use mat-color($amaranth-palette, 50) to get a color from the palette: <a href="https://v5.material.angular.io/guide/theming-your-components#using-colors-from-a-palette" target="_blank">Material Reference</a></p>
    <div style="width: 100%; height: 100px; background-color: #fce8ed"></div>
    <p style="margin-top: 50px">Use mat-contrast($amaranth-palette, 50) to get the contrasting color:</p>
    <div style="width: 100%; height: 100px; background-color: #000000"></div>
    <p style="margin-top: 50px">To use a gray color, use mat-color($mat-gray, 500): <a target="_blank" href="https://material.io/design/color/the-color-system.html#tools-for-picking-colors">Material Reference</a></p>
    <div style="width: 100%; height: 100px; background-color: #9E9E9E"></div>
  </section>
  `,
});
