import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { TransactionsService } from "../api/transactions/transactions.service";

@Component({
  selector: "app-performance",
  templateUrl: "./performance.component.html",
  styleUrls: ["./performance.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceComponent implements OnInit {
  transactions$ = this.transactionsService.list("burke-software");
  constructor(private transactionsService: TransactionsService) {}

  ngOnInit(): void {}
}
