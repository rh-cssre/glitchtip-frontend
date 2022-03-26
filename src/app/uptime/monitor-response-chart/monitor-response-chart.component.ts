import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { debounceTime, fromEvent, Subscription } from "rxjs";
import { ResponseTimeSeries } from "../uptime.interfaces";

@Component({
  selector: "gt-monitor-response-chart",
  templateUrl: "./monitor-response-chart.component.html",
  styleUrls: ["./monitor-response-chart.component.scss"],
})
export class MonitorResponseChartComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @Input() data?: ResponseTimeSeries[] | null;
  @Input() scale?: {
    yScaleMin: number;
    yScaleMax: number;
    xScaleMin: Date;
  };

  @ViewChild("containerRef") containerRef?: ElementRef;
  //Ngx-charts does not do continuous resizing, but only adjusts after window resizing completes. 
  //This is a workaround to force continous resizing
  @HostListener("window:resize")
  windowResize() {
    this.resizeChart();
  }

  delayedResize$?: Subscription;
  //Keeping these dimensions in state to avoid ngx-chart bleeding off edge of mat-card
  view: [number, number] = [0, 0];
  customColors = [
    { name: "Up", value: "#54a65a" },
    { name: "Down", value: "#e22a46" },
  ];

  //Workaround to resize chart after main-nav closes or opens
  //Change detector is needed to force Angular to recognize the change being made in the subscription
  constructor(private changeDetector: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.delayedResize$ = fromEvent(window, "resize")
      .pipe(debounceTime(400))
      .subscribe(() => {
        this.resizeChart();
        this.changeDetector.detectChanges();
      });
  }

  ngAfterViewInit(): void {
    this.resizeChart();
  }

  resizeChart() {
    if (this.containerRef) {
      this.view = [this.containerRef.nativeElement.offsetWidth, 250];
    }
  }

  ngOnDestroy(): void {
    this.delayedResize$?.unsubscribe();
  }
}
