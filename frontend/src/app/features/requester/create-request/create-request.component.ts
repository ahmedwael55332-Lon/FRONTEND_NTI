import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  BloodRequestService,
  CreateBloodRequest
} from '../../../core/services/blood-request.service';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent {

  navItems: any[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  requestForm = this.fb.group({
    bloodType: ['A', Validators.required],
    rh: ['Positive', Validators.required],
    urgency: ['normal', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private bloodRequestService: BloodRequestService,
    private router: Router
  ) {}

  submit(): void {

    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: CreateBloodRequest = {
      bloodType:
        this.requestForm.value.bloodType as
        'A' | 'B' | 'AB' | 'O',

      rh:
        this.requestForm.value.rh as
        'Positive' | 'Negative',

      urgency:
        this.requestForm.value.urgency as
        'normal' | 'emergency'
    };

    this.bloodRequestService.create(payload).subscribe({

      next: () => {

        this.loading = false;

        this.successMessage =
          'Blood request created successfully.';

        setTimeout(() => {
          this.router.navigate([
            '/requester/blood-requests'
          ]);
        }, 800);
      },

      error: (error: any) => {

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to create blood request.';
      }

    });
  }

  cancel(): void {
    this.router.navigate([
      '/requester/blood-requests'
    ]);
  }
}