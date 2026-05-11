import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { moduleMetadata } from "@storybook/angular";

import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";

export default {
  decorators: [
    moduleMetadata({
      imports: [
        MatButton,
        MatIconButton,
        MatIcon,
        LoadingButtonComponent,
        MatDivider,
      ],
    }),
  ],
  title: "Angular Material/Button",
};

export const AllButtons = () => ({
  template: `
    <div>
    <p>
        Our buttons are mostly unmodified Angular Material components, though our loading button is a simple 
        custom implementation adding a spinner to a material button.
    </p>
    </div>
    <div class=gallery>
        <div class="gallery-label">Basic</div>
        <div class="gallery-row">
            <button mat-button color="primary">Basic</button>
            <gt-loading-button
                [loading]="true"
                buttonText="Basic"
                buttonStyle="basic"
            />
            <button mat-button disabled color="primary">Disabled</button>
        </div>
        <mat-divider></mat-divider>
        <div class="gallery-label">Raised</div>
        <div class="gallery-row">
            <button mat-raised-button color="primary">Basic</button>
            <div></div>
            <button mat-raised-button disabled color="primary">Disabled</button>
        </div>
        <mat-divider></mat-divider>
        <div class="gallery-label">Stroked</div>
        <div class="gallery-row">
            <button mat-stroked-button color="primary">Basic</button>
            <gt-loading-button
                [loading]="true"
                buttonText="Basic"
                buttonStyle="stroked"
            />
            <button mat-stroked-button disabled color="primary">Disabled</button>
        </div>
        <mat-divider></mat-divider>
        <div class="gallery-label">Flat</div>
        <div class="gallery-row">
            <button mat-flat-button color="primary">Basic</button>
            <gt-loading-button
                [loading]="true"
                buttonText="Basic"
                buttonStyle="flat"
            />
            <button mat-flat-button disabled color="primary">Disabled</button>
        </div>
        <mat-divider></mat-divider>
        <div class="gallery-label">Icon</div>
        <div class="gallery-row">
            <button mat-icon-button>
                <mat-icon>settings</mat-icon>
            </button>
            <div></div>
            <button mat-icon-button disabled>
                <mat-icon>settings</mat-icon>
            </button>
        </div>
    </div>
    `,
});
