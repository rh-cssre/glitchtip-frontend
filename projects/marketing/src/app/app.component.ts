import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ViewportScroller } from "@angular/common";
import { RouterLink, RouterOutlet } from "@angular/router";
import { LinksService } from "./links.service";
import { MatToolbar } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { SupportChatService } from "./shared/support-chat.service";

@Component({
  selector: "mkt-root",
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbar,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./app.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  private links = inject(LinksService);
  private matIconRegistry = inject(MatIconRegistry);
  private supportChat = inject(SupportChatService);
  private viewportScroller = inject(ViewportScroller);

  title = "glitchtip-marketing";
  registerLink = this.links.registerLink;
  loginLink = this.links.loginLink;
  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  ngOnInit() {
    // Router anchor scrolling ignores scroll-padding-top; match it in styles.scss.
    this.viewportScroller.setOffset([0, 88]);
    this.matIconRegistry.setDefaultFontSetClass("material-symbols-filled");
    this.supportChat.resumeExistingConversation();
  }
}
