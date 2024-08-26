
import { Component, Optional } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";

@Component({
  standalone: true,
  selector: "gt-event-info",
  imports: [MatDialogModule, MatButtonModule],
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
