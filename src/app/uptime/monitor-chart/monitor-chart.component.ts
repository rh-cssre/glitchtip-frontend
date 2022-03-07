import { Component, Input, OnInit } from '@angular/core';
import { MonitorCheck } from '../uptime.interfaces';
import { DownReason } from '../uptime.interfaces';

@Component({
  selector: 'gt-monitor-chart',
  templateUrl: './monitor-chart.component.html',
  styleUrls: ['./monitor-chart.component.scss']
})
export class MonitorChartComponent implements OnInit {

  @Input() data: (MonitorCheck | false)[] = [];

  constructor(
  ) {}
  ngOnInit(): void {
    while (this.data.length < 60) {
      this.data.push(false)
  }}

  convertReasonText(reason: DownReason) {
    switch (reason) {
      case DownReason.TIMEOUT:
        return "Timeout";
      case DownReason.STATUS:
        return "Wrong status code";
      case DownReason.BODY:
        return "Expected response not found";
      case DownReason.SSL:
        return "SSL error";
      case DownReason.NETWORK:
        return "Network error";
      default:
        return "Down";
    }
  }
}
