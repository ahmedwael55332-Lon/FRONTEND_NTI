import { Component, OnInit } from '@angular/core';
import { DonorService } from '../../../core/services/donor.service';

@Component({
  selector: 'app-medical-check',
  templateUrl: './medical-check.component.html',
  styleUrls: ['./medical-check.component.css']
})
export class MedicalCheckComponent implements OnInit {

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

  errorMessage = '';
  backendMessage = '';

  eligibilityStatus = '—';

  lastDonationDate: string | null = null;

  daysSinceLastDonation: number | null = null;

  constructor(
    private donorService: DonorService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  // ==========================================
  // Load Donor Profile
  // ==========================================

  loadProfile(): void {

    this.donorService.getMyProfile().subscribe({

      next: (response: any) => {

        console.log('DONOR PROFILE RESPONSE:', response);

        const donor =
          response?.donor ||
          response?.data ||
          response;

        this.lastDonationDate =
          donor?.lastDonationDate ||
          donor?.lastDonation ||
          null;

        this.eligibilityStatus =
          donor?.eligibilityStatus ||
          '—';

        console.log(
          'Last Donation Date:',
          this.lastDonationDate
        );

      },

      error: (error: any) => {

        console.error(
          'DONOR PROFILE ERROR:',
          error
        );

      }

    });
  }

  // ==========================================
  // Check Medical Eligibility
  // ==========================================

  checkEligibility(): void {

    if (this.loading) {
      return;
    }

    this.loading = true;

    this.errorMessage = '';
    this.backendMessage = '';

    this.donorService.checkMyMedicalEligibility().subscribe({

      next: (response: any) => {

        console.log(
          'MEDICAL CHECK RESPONSE:',
          response
        );

        this.loading = false;

        const data =
          response?.data ||
          response;

        // Eligibility Status
        this.eligibilityStatus =
          data?.eligibilityStatus ||
          '—';

        // Days Since Last Donation
        this.daysSinceLastDonation =
          data?.daysSinceLastDonation ??
          null;

        // Last Donation Date
        this.lastDonationDate =
          data?.lastDonationDate ||
          data?.lastDonation ||
          this.lastDonationDate ||
          null;

        // Backend Message
        this.backendMessage =
          response?.message ||
          data?.message ||
          'Medical eligibility checked successfully.';

      },

      error: (error: any) => {

        console.error(
          'MEDICAL CHECK ERROR:',
          error
        );

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to check medical eligibility.';

        this.backendMessage = '';

      }

    });
  }

  // ==========================================
  // Format Date
  // ==========================================

  formatDate(date: string | null): string {

    if (!date) {
      return '—';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );
  }

}