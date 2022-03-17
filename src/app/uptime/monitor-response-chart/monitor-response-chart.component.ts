import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { ScaleType } from "@swimlane/ngx-charts";
import { MonitorCheck } from "../uptime.interfaces";


@Component({
  selector: "gt-monitor-response-chart",
  templateUrl: "./monitor-response-chart.component.html",
  styleUrls: ["./monitor-response-chart.component.scss"],
})
export class MonitorResponseChartComponent implements OnInit, AfterViewInit{
  @ViewChild('containerRef') containerRef?: ElementRef;
  @Input() raw: MonitorCheck[] = [];
  data: any[] = [];

  // options
  view: [number, number] = [0,0];
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = "Check Time";
  yAxisLabel: string = "Response Time (ms)";
  timeline: boolean = false;
  xScaleMin = new Date().getTime() - (1 * 60 * 60 * 1000)
  xScaleMax = new Date().getTime()
  colorScheme = { domain: ["#54a65a", "#e22a46"], group: ScaleType.Ordinal, selectable: true, name: 'Something', };

  constructor(
  ) {}

  ngOnInit(): void {
    this.data = this.createSeries(this.raw)
  }
  ngAfterViewInit(): void {
    console.log(this.containerRef)
    if (this.containerRef) {
      this.view = [this.containerRef.nativeElement.offsetWidth, 250]
      console.log(this.view)
    }
  }

  // Split each series into groups so chart does not combine points between which there have been results without response times. 
  // Might need to figure out what to do with heartbeat monitors
  // Currently filtering out down checks.
  createSeries(input: MonitorCheck[]) {
    const series = input
      .reduce(
        (resultArray, check) => {
          if (!check.responseTime || !check.isUp) {
            resultArray.push([]);
          } else {
            resultArray[resultArray.length - 1].push(this.formatData(check));
          }
          return resultArray;
        },
        [[]] as any[][]
      )
      .filter((array) => array.length);
    return this.labelSeries(series);
  }

  formatData(check: MonitorCheck) {
    return {
      name: new Date(check.startCheck),
      value: this.convertTimeDelta(check.responseTime),
    };
  }

  convertTimeDelta(value: string | null) {
    let milliseconds = 0;
    if (value) {
      if (value.includes(" ")) {
        milliseconds += parseInt(value.split(" ")[0], 10) * 86400000;
        value = value.split(" ")[1];
      }

      const splitValue = value.split(":");
      milliseconds += parseInt(splitValue[0], 10) * 3600000;
      milliseconds += parseInt(splitValue[1], 10) * 60000;
      milliseconds += parseFloat(splitValue[2]) * 1000;
      return Math.round(milliseconds);
    } else {
      return null;
    }
  }

  labelSeries(input: any[][]) {
    return input.map((item) => {
      return {
        name: "Up",
        series: item,
      };
    });
  }

  onResize() {
    if (this.containerRef) {
      this.view = [this.containerRef.nativeElement.offsetWidth, 200]
    }
  }
}
