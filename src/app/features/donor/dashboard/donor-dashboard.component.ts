import { Component, OnInit } from '@angular/core';
import { DashboardNavItem } from '../../../shared/dashboard-layout/dashboard-layout.component';
import { DonorService } from '../../../core/services/donor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donor-dashboard',
  templateUrl: './donor-dashboard.component.html',
  styleUrls: ['./donor-dashboard.component.css']
})
export class DonorDashboardComponent implements OnInit {

  navItems: DashboardNavItem[] = [
    {
      label: 'My Profile',
      icon: 'person',
      route: '/donor/profile'
    },
    {
      label: 'Medical Check',
      icon: 'health_and_safety',
      route: '/donor/medical-check'
    },
    {
      label: 'Emergency Alerts',
      icon: 'notifications',
      route: '/donor/notifications'
    }
  ];

  loading = false;
  errorMessage = '';

  profileExists = true;

  bloodType = '—';
  rh = '—';
  lastDonationDate = '—';
  eligibilityStatus = '—';
  availabilityStatus = '—';

  constructor(
    private donorService: DonorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {

    this.loading = true;
    this.errorMessage = '';

    this.donorService.getMyProfile().subscribe({

      next: (response: any) => {

        console.log('DONOR DASHBOARD RESPONSE:', response);

        this.loading = false;

        const donor =
          response?.donor ||
          response?.data ||
          response;

        if (!donor) {
          this.profileExists = false;
          return;
        }

        this.profileExists = true;

        this.bloodType =
          donor.bloodType || '—';

        this.rh =
          donor.rh || '—';

        this.lastDonationDate =
          this.formatDate(
            donor.lastDonationDate ||
            donor.lastDonation
          );

        this.eligibilityStatus =
          donor.eligibilityStatus || '—';

        this.availabilityStatus =
          donor.availabilityStatus || '—';
      },

      error: (error: any) => {

        console.error(
          'DONOR DASHBOARD ERROR:',
          error
        );

        this.loading = false;

        // Profile not created yet — show prompt
        if (error?.status === 404) {
          this.profileExists = false;
          this.errorMessage = '';
          return;
        }

        this.errorMessage =
          error?.error?.message ||
          'Failed to load donor profile.';
      }

    });
  }

  goToProfile(): void {
    this.router.navigate(['/donor/profile']);
  }

  formatDate(date: string | null | undefined): string {

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
        month: 'short',
        day: 'numeric'
      }
    );
  }
}