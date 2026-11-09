import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDivider } from "@angular/material/divider";
import { RouterLink } from "@angular/router";
import { SimpleTableComponent } from "../shared/simple-table/simple-table.component";
import { PageShellComponent } from "../shared/page-shell/page-shell.component";

@Component({
  selector: "mkt-hipaa",
  imports: [
    PageShellComponent,
    MatButtonModule,
    MatExpansionModule,
    MatDivider,
    RouterLink,
    SimpleTableComponent,
  ],
  templateUrl: "./hipaa.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./hipaa.component.scss"],
})
export class HipaaComponent {
  subProcessorColumns = ["Sub-Processor", "Purpose"];
  subProcessorRows = [
    ["DigitalOcean (NYC1)", "Infrastructure & hosting (BAA in place)"],
    [
      "Mailgun",
      "Transactional email, not covered by a BAA. Alert emails include issue titles, so keep PHI out of error messages or turn off email alerts for those projects",
    ],
    ["Stripe", "Payment processing (billing data only, no PHI)"],
    [
      "Cloudflare",
      "DNS only on the US instance (app.glitchtip.com), no access to request contents",
    ],
    [
      "Chatwoot",
      "Support email and chat, not covered by a BAA. Never include PHI in support messages",
    ],
  ];

  faqs = [
    {
      question: "Does GlitchTip sign a Business Associate Agreement?",
      answer:
        "Yes. BAAs are available on our Large plan. Contact support@glitchtip.com to get a BAA in place before processing PHI.",
    },
    {
      question:
        "Is the EU-hosted region (eu.glitchtip.com) covered under a US BAA?",
      answer:
        "No. BAAs are currently available only for the US instance (app.glitchtip.com) hosted on DigitalOcean NYC1. The EU instance is not covered under a US BAA.",
    },
    {
      question: "Can I self-host for HIPAA compliance?",
      answer:
        "Yes. GlitchTip is open-source and can be self-hosted on your own HIPAA-compliant infrastructure. You are responsible for your own security controls, BAAs with sub-processors, and compliance obligations.",
    },
    {
      question: "What is GlitchTip's breach notification timeline?",
      answer:
        "Burke Software will notify affected customers without undue delay and no later than 72 hours after becoming aware of a breach, in alignment with GDPR and HIPAA requirements.",
    },
    {
      question: "Can I send PHI to GlitchTip support?",
      answer:
        "No. Support email and chat are not covered by a BAA. Describe the problem without PHI, for example by linking to the issue in your GlitchTip account.",
    },
  ];
}
