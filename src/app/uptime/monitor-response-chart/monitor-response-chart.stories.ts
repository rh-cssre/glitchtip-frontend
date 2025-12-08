import {
  type Meta,
  type StoryObj,
  applicationConfig,
} from "@storybook/angular";
import { provideAnimations } from "@angular/platform-browser/animations";
import { MonitorResponseChart } from "./monitor-response-chart";
import { ResponseTimeSeries } from "../uptime.interfaces";

// This provides BrowserAnimationsModule, required by ngx-charts.
const meta: Meta<MonitorResponseChart> = {
  title: "Charts/Monitor Response Chart",
  component: MonitorResponseChart,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
};

export default meta;
type Story = StoryObj<MonitorResponseChart>;

// --- Mock Data Generation ---

const now = new Date();
const MOCK_SCALE = {
  yScaleMin: 0,
  yScaleMax: 1200,
  xScaleMin: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
};

type CheckEvent = { time: Date; status: "Up" | "Down"; value: number };

const generateCheckEvents = (
  totalMinutes: number,
  downPattern: (minute: number) => boolean,
): CheckEvent[] => {
  const events: CheckEvent[] = [];
  for (let i = 0; i < totalMinutes; i++) {
    const time = new Date(now.getTime() - (totalMinutes - i) * 60 * 1000);
    const isDown = downPattern(i);
    const value = isDown
      ? Math.floor(Math.random() * (1000 - 800 + 1)) + 800
      : Math.floor(Math.random() * (350 - 80 + 1)) + 80;

    events.push({
      time,
      status: isDown ? "Down" : "Up",
      value,
    });
  }
  return events;
};

/**
 * Processes a flat list of check events into the format ngx-charts expects,
 * grouping consecutive "Up" and "Down" events into their own series.
 */
const processEventsForChart = (events: CheckEvent[]): ResponseTimeSeries[] => {
  const chartData: ResponseTimeSeries[] = [];
  let currentUpSeries = [];
  let currentDownSeries = [];

  for (const event of events) {
    if (event.status === "Up") {
      // If we are transitioning from Down to Up, finalize the Down series first.
      if (currentDownSeries.length > 0) {
        chartData.push({ name: "Down", series: currentDownSeries });
        currentDownSeries = [];
      }
      currentUpSeries.push({ name: event.time, value: event.value });
    } else {
      // Event is "Down"
      // If we are transitioning from Up to Down, finalize the Up series first.
      if (currentUpSeries.length > 0) {
        chartData.push({ name: "Up", series: currentUpSeries });
        currentUpSeries = [];
      }
      currentDownSeries.push({ name: event.time, value: event.value });
    }
  }

  // Add any remaining series at the end of the loop.
  if (currentUpSeries.length > 0) {
    chartData.push({ name: "Up", series: currentUpSeries });
  }
  if (currentDownSeries.length > 0) {
    chartData.push({ name: "Down", series: currentDownSeries });
  }

  return chartData;
};

// --- Stories ---

/**
 * A realistic scenario with healthy periods, a single minute of downtime,
 * and a separate, extended period of downtime.
 */
export const MixedUptimeAndDowntime: Story = {
  args: {
    data: processEventsForChart(
      generateCheckEvents(
        150,
        (minute) => minute === 80 || (minute >= 110 && minute <= 115),
      ),
    ),
    scale: MOCK_SCALE,
  },
};

/**
 * Shows a perfectly healthy monitor with no downtime.
 */
export const CompletelyUp: Story = {
  args: {
    data: processEventsForChart(generateCheckEvents(120, () => false)),
    scale: MOCK_SCALE,
  },
};

/**
 * Demonstrates an extended, connected period of downtime after an initial
 * period of healthy uptime.
 */
export const ExtendedDowntime: Story = {
  args: {
    data: processEventsForChart(
      generateCheckEvents(90, (minute) => minute >= 60),
    ),
    scale: MOCK_SCALE,
  },
};
