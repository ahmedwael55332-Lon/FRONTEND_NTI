import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DonorService } from '../../../core/services/donor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donor-profile',
  templateUrl: './donor-profile.component.html',
  styleUrls: ['./donor-profile.component.css']
})
export class DonorProfileComponent implements OnInit {

  navItems: any[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/donor'
    },
    {
      label: 'Profile',
      icon: 'person',
      route: '/donor/profile'
    },
    {
      label: 'Medical Check',
      icon: 'health_and_safety',
      route: '/donor/medical-check'
    },
    {
      label: 'Notifications',
      icon: 'notifications',
      route: '/donor/notifications'
    }
  ];

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  profileExists = false;

  eligibilityStatus = '';
  daysSinceLastDonation: number | null = null;

  donorForm = this.fb.group({
    bloodType: ['', Validators.required],
    rh: ['', Validators.required],
    lastDonationDate: [''],
    availabilityStatus: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private donorService: DonorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.donorService.getMyProfile().subscribe({

      next: (response) => {
        this.loading = false;
        this.profileExists = true;

        const donor = response?.donor;

        if (!donor) {
          this.profileExists = false;
          return;
        }

        this.donorForm.patchValue({
          bloodType: donor.bloodType || 'A',
          rh: donor.rh || 'Positive',
          lastDonationDate: donor.lastDonationDate
            ? this.formatDateForInput(donor.lastDonationDate)
            : '',
          availabilityStatus:
            donor.availabilityStatus || 'Available'
        });

        this.eligibilityStatus =
          donor.eligibilityStatus || '';
      },

      error: (error) => {
        this.loading = false;

        if (error?.status === 404) {
          // Profile doesn't exist yet.
          // Show create form instead of treating it as a fatal error.
          this.profileExists = false;
          this.errorMessage = '';
          this.successMessage = '';
          return;
        }

        this.errorMessage =
          error?.error?.message ||
          'Failed to load donor profile.';
      }

    });
  }

  saveChanges(): void {

    if (this.donorForm.invalid) {
      this.donorForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.donorForm.value;

    const payload: any = {
      bloodType: formValue.bloodType,
      rh: formValue.rh,
      availabilityStatus: formValue.availabilityStatus
    };

    // Only send lastDonationDate when it has a value.
    if (formValue.lastDonationDate) {
      payload.lastDonationDate =
        formValue.lastDonationDate;
    } else {
      payload.lastDonationDate = null;
    }

    if (!this.profileExists) {

      this.donorService.create(payload).subscribe({

        next: (response) => {
          this.saving = false;
          this.profileExists = true;

          const donor = response?.donor;

          if (donor) {
            this.eligibilityStatus =
              donor.eligibilityStatus || '';
          }

          this.successMessage =
            'Donor profile created successfully.';
        },

        error: (error) => {
          this.saving = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to create donor profile.';
        }

      });

      return;
    }

    // Existing profile -> update
    this.donorService.updateMyProfile(payload).subscribe({

      next: (response) => {
        this.saving = false;

        const donor = response?.donor;

        if (donor) {
          this.eligibilityStatus =
            donor.eligibilityStatus || '';
        }

        this.successMessage =
          'Donor profile updated successfully.';
      },

      error: (error) => {
        this.saving = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to update donor profile.';
      }

    });
  }

  medicalCheck(): void {

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.donorService.checkMyMedicalEligibility().subscribe({

      next: (response) => {
        this.loading = false;

        this.eligibilityStatus =
          response?.eligibilityStatus || '';

        this.daysSinceLastDonation =
          response?.daysSinceLastDonation ?? null;

        this.successMessage =
          response?.message ||
          'Medical eligibility checked successfully.';
      },

      error: (error) => {
        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to check medical eligibility.';
      }

    });
  }

  cancel(): void {
    this.router.navigate(['/donor']);
  }

  private formatDateForInput(dateValue: string): string {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString().split('T')[0];
  }
}