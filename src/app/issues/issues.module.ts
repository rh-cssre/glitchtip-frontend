import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssuesRoutingModule } from './issues-routing.module';
import { IssuesPageComponent } from './issues-page/issues-page.component';


@NgModule({
  declarations: [IssuesPageComponent],
  imports: [
    CommonModule,
    IssuesRoutingModule
  ]
})
export class IssuesModule { }
