import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { UptimeService } from "../uptime.service";
import { map, tap } from "rxjs";

@Component({
  selector: "gt-monitor-response-chart",
  templateUrl: "./monitor-response-chart.component.html",
  styleUrls: ["./monitor-response-chart.component.scss"],
})
export class MonitorResponseChartComponent implements OnInit, AfterViewInit {
  @ViewChild("containerRef") containerRef?: ElementRef;
  activeMonitorRecentChecksSeries$ =
    this.uptimeService.activeMonitorRecentChecksSeries$;
  yScaleDimensions$ = this.uptimeService.activeMonitorRecentChecksSeries$.pipe(
    map((series) => {
      let yScaleMax = 20;
      let currentTime = new Date()
      currentTime.setHours(currentTime.getHours() - 1)
      series?.forEach((subseries) => {
        subseries.series.forEach((dataItem) => {
          if (dataItem.value > yScaleMax) {
            yScaleMax = dataItem.value;
          }
          // if (dataItem.name < currentTime){
          //   currentTime = dataItem.name
          // }
        });
      });
      return {
        yScaleMax,
        yScaleMin: 0 - yScaleMax / 4,

        xScaleMax: new Date().getTime(), 
      };
    })
  );

  view: [number, number] = [0, 0];
  xScaleMin = new Date().getTime() - 1 * 60 * 60 * 1000;
  xScaleMax = new Date().getTime();
  customColors = [
    { name: "Up", value: "#54a65a" },
    { name: "Down", value: "#e22a46" },
  ];

  constructor(private uptimeService: UptimeService) {}

  ngOnInit(): void {
    this.uptimeService.activeMonitorRecentChecksSeries$.pipe(tap((series) => console.log(series)))
  }

  ngAfterViewInit(): void {
    if (this.containerRef) {
      this.view = [this.containerRef.nativeElement.offsetWidth, 250];
    }
  }

  findMaxYValue() {}

  onResize() {
    if (this.containerRef) {
      this.view = [this.containerRef.nativeElement.offsetWidth, 200];
    }
  }
}
