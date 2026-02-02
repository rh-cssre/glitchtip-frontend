import { Component, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { LinksService } from "./links.service";
import { MatToolbar } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "mkt-root",
  imports: [RouterOutlet, RouterLink, MatToolbar, MatButtonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  private links = inject(LinksService);

  title = "glitchtip-marketing";
  registerLink = this.links.registerLink;
  loginLink = this.links.loginLink;
}
