import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsLoggedInGuard } from "./guards/is-logged-in.guard";

const routes: Routes = [
  {
    path: "issues",
    loadChildren: () =>
      import("./issues/issues.module").then(m => m.IssuesModule),
    canActivate: [IsLoggedInGuard]
  },
  {
    path: "login",
    loadChildren: () => import("./login/login.module").then(m => m.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
