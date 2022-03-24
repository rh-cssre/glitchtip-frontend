import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  HostListener
} from "@angular/core";
import { ResponseTimeSeries } from "../uptime.interfaces";

@Component({
  selector: "gt-monitor-response-chart",
  templateUrl: "./monitor-response-chart.component.html",
  styleUrls: ["./monitor-response-chart.component.scss"],
})
export class MonitorResponseChartComponent implements AfterViewInit, OnChanges {
  @Input() data?: ResponseTimeSeries[] | null;
  @Input() scale?: {
    yScaleMin: number;
    yScaleMax: number;
    xScaleMin: Date;
  };
  @Input() navOpen?: boolean | null;

  @ViewChild("containerRef") containerRef?: ElementRef;
  @HostListener("window:resize")
  windowResize() {
    this.resizeChart()
  }

  view: [number, number] = [0, 0];
  customColors = [
    { name: "Up", value: "#54a65a" },
    { name: "Down", value: "#e22a46" },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    this.resizeChart();
  }

  ngAfterViewInit(): void {
    this.resizeChart();
  }

  resizeChart() {
    if (this.containerRef) {
      this.view = [this.containerRef.nativeElement.offsetWidth, 250];
    }
  }
}
