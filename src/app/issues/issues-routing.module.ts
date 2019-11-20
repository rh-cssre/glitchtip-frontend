import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IssuesPageComponent } from './issues-page/issues-page.component';


const routes: Routes = [{ path: '', component: IssuesPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssuesRoutingModule { }
