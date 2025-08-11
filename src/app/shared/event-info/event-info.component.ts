import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "gt-event-info",
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: "./event-info.component.html",
  styleUrls: ["./event-info.component.scss"],
})
export class EventInfoComponent {
  private dialogRef = inject<MatDialogRef<EventInfoComponent>>(MatDialogRef, {
    optional: true,
  });

  dialog = false;

  constructor() {
    const dialogRef = this.dialogRef;

    if (dialogRef) {
      this.dialog = true;
    }
  }

  closeDialog(): void {
    this.dialogRef!.close();
  }
}
