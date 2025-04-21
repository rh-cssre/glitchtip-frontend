import { MatCardModule } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { moduleMetadata } from "@storybook/angular";

export default {
  decorators: [
    moduleMetadata({
      imports: [MatCardModule, MatDivider],
    }),
  ],
  title: "Angular Material/Card",
};

export const Card = () => ({
  template: `
    <div class=gallery>
        <mat-card>
            <mat-card-header>
                <mat-card-title i18n>Material Card Title</mat-card-title>
            </mat-card-header>
            <mat-divider></mat-divider>
            <mat-card-content>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </mat-card-content>
        </mat-card>
    </div>
    `,
});
