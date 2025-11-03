import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  input,
  signal,
} from "@angular/core";
import { ResponseTimeSeries } from "../uptime.interfaces";
import { AreaChartModule } from "@swimlane/ngx-charts";
import { DatePipe } from "@angular/common";

@Component({
  selector: "gt-monitor-response-chart",
  templateUrl: "./monitor-response-chart.html",
  styles: `
    .chart-container {
      height: 250px;
      width: 100%;
      float: right;
    }
  `,
  imports: [AreaChartModule, DatePipe],
})
export class MonitorResponseChart implements OnDestroy {
  // Manages observation of the chart's container element for size changes.
  private resizeObserver?: ResizeObserver;
  private _containerRef?: ElementRef<HTMLDivElement>;

  data = input<ResponseTimeSeries[] | null | undefined>();
  scale = input<{
    yScaleMin: number;
    yScaleMax: number;
    xScaleMin: Date;
  }>();

  chartData = computed(() => {
    const currentData = this.data();
    if (!currentData) {
      return [];
    }

    return currentData.map((series) => {
      if (series.series.length === 1) {
        const originalPoint = series.series[0];
        const phantomPoint = {
          name: new Date(originalPoint.name.getTime() + 2000),
          value: originalPoint.value,
        };
        return {
          ...series,
          series: [originalPoint, phantomPoint],
        };
      }
      return series;
    });
  });

  view = signal<[number, number]>([0, 250]);
  customColors = [
    { name: "Up", value: "#54a65a" },
    { name: "Down", value: "#e22a46" },
  ];

  // ViewChild setter handles the ResizeObserver setup.
  @ViewChild("containerRef")
  set containerRef(element: ElementRef<HTMLDivElement> | undefined) {
    if (element) {
      this._containerRef = element;
      this.initializeResizeObserver();
    } else if (this._containerRef) {
      this.resizeObserver?.disconnect();
      this._containerRef = undefined;
    }
  }

  initializeResizeObserver(): void {
    this.resizeObserver?.disconnect();

    this.resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;

      this.view.set([width, 250]);
    });

    if (this._containerRef) {
      this.resizeObserver.observe(this._containerRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
