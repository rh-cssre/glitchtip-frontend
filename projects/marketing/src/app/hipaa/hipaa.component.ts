import { Component } from "@angular/core";
import { MatCard } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDivider } from "@angular/material/divider";
import { RouterLink } from "@angular/router";
import { SimpleTableComponent } from "../shared/simple-table/simple-table.component";

@Component({
  selector: "mkt-hipaa",
  imports: [
    MatCard,
    MatButtonModule,
    MatExpansionModule,
    MatDivider,
    RouterLink,
    SimpleTableComponent,
  ],
  templateUrl: "./hipaa.component.html",
  styleUrls: ["./hipaa.component.scss"],
})
export class HipaaComponent {
  subProcessorColumns = ["Sub-Processor", "Purpose"];
  subProcessorRows = [
    ["DigitalOcean (NYC1)", "Infrastructure & hosting"],
    ["Mailgun", "Transactional email (alerts)"],
    ["Stripe", "Payment processing (billing data only)"],
    ["Cloudflare", "DNS & network proxy (app.glitchtip.com)"],
  ];

  faqs = [
    {
      question: "Does GlitchTip sign a Business Associate Agreement?",
      answer:
        "Yes. BAAs are available on our Large plan. Contact sales@glitchtip.com to get a BAA in place before processing PHI.",
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
        "Burke Software will notify affected customers without undue delay and no later than 72 hours after discovery of a confirmed breach, in alignment with GDPR and HIPAA requirements.",
    },
  ];
}
