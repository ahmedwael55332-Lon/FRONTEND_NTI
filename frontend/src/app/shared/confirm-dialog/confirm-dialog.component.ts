import { Component } from '@angular/core';
import { ConfirmService } from '../../core/services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  constructor(public confirmService: ConfirmService) {}

  confirm(): void {
    this.confirmService.confirm();
  }

  cancel(): void {
    this.confirmService.cancel();
  }
}
