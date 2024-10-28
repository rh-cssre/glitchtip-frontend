import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { LinksService } from "./links.service";
import { MatToolbar } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "mkt-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbar, MatButtonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "glitchtip-marketing";
  registerLink = this.links.registerLink;
  loginLink = this.links.loginLink;

  public constructor(private links: LinksService) {}
}
