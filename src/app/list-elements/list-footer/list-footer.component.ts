import { Component, Input } from '@angular/core';
import { Paginator } from 'src/app/shared/stateful-service/pagination-stateful-service';

@Component({
  selector: 'gt-list-footer',
  templateUrl: './list-footer.component.html',
  styleUrls: ['./list-footer.component.scss']
})
export class ListFooterComponent {
  @Input() paginator?: Paginator
}
