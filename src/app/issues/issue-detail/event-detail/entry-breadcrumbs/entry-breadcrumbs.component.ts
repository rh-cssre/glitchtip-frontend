import {
  KeyValue,
  NgClass,
  JsonPipe,
  DatePipe,
  KeyValuePipe,
} from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Json } from "src/app/interface-primitives";
import { IssueDetailService } from "../../issue-detail.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "gt-entry-breadcrumbs",
  templateUrl: "./entry-breadcrumbs.component.html",
  styleUrls: ["./entry-breadcrumbs.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDividerModule,
    NgClass,
    MatButtonModule,
    MatIconModule,
    JsonPipe,
    DatePipe,
    KeyValuePipe,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class EntryBreadcrumbsComponent implements AfterViewInit {
  private issueDetailService = inject(IssueDetailService);

  @ViewChild("breadBox") breadBox?: ElementRef;

  breadcrumbs = this.issueDetailService.breadcrumbs;
  showShowMore = this.issueDetailService.showShowMore;

  selectedCategories = signal<string[]>([]);

  availableCategories = computed(() => {
    const values = this.breadcrumbs()?.values ?? [];
    return [...new Set(values.map((b) => b.category).filter(Boolean))].sort();
  });

  filteredBreadcrumbs = computed(() => {
    const crumbs = this.breadcrumbs();
    const selected = this.selectedCategories();
    if (!crumbs) return undefined;
    if (selected.length === 0) return crumbs;
    return { ...crumbs, values: crumbs.values.filter((b) => selected.includes(b.category)) };
  });

  ngAfterViewInit() {
    if (this.breadBox?.nativeElement.offsetHeight >= 1250) {
      setTimeout(() => this.issueDetailService.setShowShowMore(true));
    }
  }

  expandBreadcrumbs() {
    this.issueDetailService.setShowShowMore(false);
  }

  keepOrder = (
    a: KeyValue<string, Json>,
    b: KeyValue<string, Json>,
  ): number => {
    return 0;
  };
}
