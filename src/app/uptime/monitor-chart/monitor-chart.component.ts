import { Component, Input } from '@angular/core';
import { MonitorCheck } from '../uptime.interfaces';

@Component({
  selector: 'gt-monitor-chart',
  templateUrl: './monitor-chart.component.html',
  styleUrls: ['./monitor-chart.component.scss']
})
export class MonitorChartComponent {

  @Input() data?: MonitorCheck[];

}
