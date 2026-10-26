import {
  Component,
  computed,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { ResponsiveImageComponent } from "../responsive-image/responsive-image.component";

interface Feature {
  id: string;
  icon: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
}

@Component({
  selector: "mkt-feature-switcher",
  imports: [MatIcon, ResponsiveImageComponent],
  templateUrl: "./feature-switcher.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./feature-switcher.component.scss",
})
export class FeatureSwitcherComponent {
  protected readonly features: Feature[] = [
    {
      id: "error-tracking",
      icon: "breaking_news",
      title: "Error Tracking",
      body: "Report your website or application's exceptions, log messages, Content Security Policy violations, and more to one place to triage and resolve. GlitchTip works with Sentry's open source client SDKs to receive error data from your application.",
      imageSrc: "assets/home/issues-list@1x.png",
      imageAlt: "Screenshot of GlitchTip Issues Page",
    },
    {
      id: "performance",
      icon: "avg_pace",
      title: "Performance Monitoring",
      body: "Find out where your app is slow. GlitchTip takes a simple, works out of the box approach. No dashboard building or metrics hunting. Just find your slowest web requests, database calls, and other transactions.",
      imageSrc: "assets/home/performance@1x.png",
      imageAlt: "Screenshot of GlitchTip Performance Page",
    },
    {
      id: "uptime",
      icon: "share_eta",
      title: "Uptime Monitoring",
      body: "GlitchTip can ping your site and warn you when it's not responding. Or reverse it and send GlitchTip a request on schedule. If GlitchTip doesn't receive your ping, it sends you an alert via email or webhook.",
      imageSrc: "assets/home/uptime-monitors@1x.png",
      imageAlt: "Screenshot of GlitchTip Uptime Monitors",
    },
    {
      id: "logs",
      icon: "text_snippet",
      title: "Logs",
      body: "Search and filter your application logs alongside your errors and performance data. Keep everything in one place for faster debugging.",
      imageSrc: "assets/home/logs@1x.png",
      imageAlt: "Screenshot of GlitchTip Logs",
    },
  ];

  protected readonly active = signal(0);
  protected readonly current = computed(() => this.features[this.active()]);
}
