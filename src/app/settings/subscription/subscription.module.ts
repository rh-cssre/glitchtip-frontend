import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SubscriptionRoutingModule } from "./subscription-routing.module";
import { SubscriptionComponent } from "./subscription.component";
import { PaymentComponent } from "./payment/payment.component";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
    imports: [
        CommonModule,
        SubscriptionRoutingModule,
        LoadingButtonComponent,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDividerModule,
        MatIconModule,
        EventInfoComponent,
        SubscriptionComponent, PaymentComponent,
    ],
})
export class SubscriptionModule {}
