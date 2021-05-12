import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-new-alert-recipient",
  templateUrl: "./new-alert-recipient.component.html",
  styleUrls: ["./new-alert-recipient.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewAlertRecipientComponent implements OnInit {
  selected = null;
  constructor() {}

  ngOnInit(): void {}
}
