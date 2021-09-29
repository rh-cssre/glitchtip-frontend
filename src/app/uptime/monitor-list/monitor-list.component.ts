import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "gt-monitor-list",
  templateUrl: "./monitor-list.component.html",
  styleUrls: ["./monitor-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log("Loaded")
  }

}
