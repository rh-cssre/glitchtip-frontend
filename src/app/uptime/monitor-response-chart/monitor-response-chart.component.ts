import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { ResponseTimeSeries } from "../uptime.interfaces";

@Component({
  selector: "gt-monitor-response-chart",
  templateUrl: "./monitor-response-chart.component.html",
  styleUrls: ["./monitor-response-chart.component.scss"],
})
export class MonitorResponseChartComponent implements OnInit, AfterViewInit {
  @ViewChild("containerRef") containerRef?: ElementRef;
  @Input() data: ResponseTimeSeries[] | null = null;
  @Input() scale: { yScaleMin: number, yScaleMax: number, xScaleMin: Date, xScaleMax: Date } | null =  null;

  view: [number, number] = [0, 0];
  customColors = [
    { name: "Up", value: "#54a65a" },
    { name: "Down", value: "#e22a46" },
  ];

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.containerRef) {
      this.view = [this.containerRef.nativeElement.offsetWidth, 250];
    }
  }

  findMaxYValue() {}

  onResize() {
    if (this.containerRef) {
      this.view = [this.containerRef.nativeElement.offsetWidth, 250];
    }
  }
}
