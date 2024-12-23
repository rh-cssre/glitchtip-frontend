export default {
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

export const Icons = () => ({
  template: `
  <section class="mat-typography">
    <h1>Icons</h1>
    <p>Angular material has a bunch of icons. You can find a pretty exhaustive list of them <a href="https://www.angularjswiki.com/angular/angular-material-icons-list-mat-icon-list/" target="_blank">here</a>
    <p>Also, <a href="https://material.angular.io/components/icon/overview" target="_blank">here's</a> Angular's documentation on icons</p>
    <p>Make sure to add the appropriate aria classes for accessibility!</p>
    <mat-divider></mat-divider>
    <mat-icon>delete</mat-icon>
    <p aria-hidden="false" aria-label="this is trash">This is an icon</p>
    <button mat-icon-button color="accent" aria-label="Example icon-button with a heart icon">
      <mat-icon>favorite</mat-icon>
    </button>
    <p>This is a button icon</p>
    <button mat-flat-button color="primary">
      <mat-icon aria-hidden="true">done</mat-icon>
      Resolve
    </button>
    <p>If the icon is purely decorative, you can make aria hidden true</p>
  </section>
  <section class="mat-typography">
    <h1>Custom Icons</h1>
    <p>In addition to Angular's icons, we have added custom ones in 'index.html'</p>
    <div style="display: flex; align-items: center; margin: 16px">
      <div>#gitlab:</div>
      <svg style="width: 32px; height: 32px; margin-left: 8px; margin-right: 32px"><use xlink:href="#gitlab"></use></svg>
      <div>#google:</div>
      <svg style="width: 32px; height: 32px; margin-left: 8px; margin-right: 32px"><use xlink:href="#google"></use></svg>
      <div>#microsoft:</div>
      <svg style="width: 32px; height: 32px; margin-left: 8px; margin-right: 32px"><use xlink:href="#microsoft"></use></svg>
    </div>
  </section>
  `,
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
