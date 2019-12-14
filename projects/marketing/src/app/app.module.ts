import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule.withServerTransition({ appId: 'serverApp' }), MatToolbarModule, MatButtonModule, MatCardModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
