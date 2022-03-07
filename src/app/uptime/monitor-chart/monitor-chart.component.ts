import { Component, Input, OnInit } from '@angular/core';
import { MonitorCheck } from '../uptime.interfaces';

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

}
