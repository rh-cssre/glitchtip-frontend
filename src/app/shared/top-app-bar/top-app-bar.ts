import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
  selector: "gt-top-app-bar",
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  templateUrl: "./top-app-bar.html",
  styleUrls: ["./top-app-bar.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopAppBar {}
