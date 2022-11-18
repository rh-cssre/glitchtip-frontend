import { Component, Optional } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";

@Component({
  selector: "gt-event-info",
  templateUrl: "./event-info.component.html",
  styleUrls: ["./event-info.component.scss"],
})
export class EventInfoComponent {
  dialog = false;

  constructor(@Optional() private dialogRef: MatDialogRef<EventInfoComponent>) {
    if (dialogRef) {
      this.dialog = true;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
