import { Component, OnInit } from '@angular/core';
import { DashboardNavItem } from '../../../shared/dashboard-layout/dashboard-layout.component';
import { DonorService } from '../../../core/services/donor.service';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-donors',
  templateUrl: './donors.component.html',
  styleUrls: ['./donors.component.css']
})
export class DonorsComponent implements OnInit {

  navItems: DashboardNavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/admin'
    },
    {
      label: 'Users',
      icon: 'group',
      route: '/admin/users'
    },
    {
      label: 'Donors',
      icon: 'volunteer_activism',
      route: '/admin/donors'
    },
    {
      label: 'Blood Units',
      icon: 'bloodtype',
      route: '/admin/blood-units'
    },
    {
      label: 'Blood Requests',
      icon: 'assignment',
      route: '/admin/blood-requests'
    }
  ];

  donors: any[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private donorService: DonorService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadDonors();
  }

  loadDonors(): void {
    this.loading = true;
    this.errorMessage = '';

    this.donorService.getAll().subscribe({

      next: (response: any) => {
        this.loading = false;

        this.donors =
          response?.donors ||
          response?.data?.donors ||
          response?.data ||
          [];

      },

      error: (error: any) => {
        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load donors.';
      }

    });
  }

  medicalCheck(donor: any): void {

    const id = donor?._id || donor?.id;

    if (!id) {
      this.errorMessage = 'Donor ID is missing.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.donorService.medicalCheck(id).subscribe({

      next: (response: any) => {
        this.loading = false;

        const updatedDonor =
          response?.donor ||
          response?.data?.donor;

        if (updatedDonor) {
          const index = this.donors.findIndex(
            item => (item?._id || item?.id) === id
          );

          if (index !== -1) {
            this.donors[index] = updatedDonor;
          }
        }

        this.successMessage =
          response?.message ||
          'Medical eligibility checked successfully.';
      },

      error: (error: any) => {
        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to check medical eligibility.';
      }

    });
  }

  deleteDonor(donor: any): void {
    const id = donor?._id || donor?.id;

    if (!id) {
      this.errorMessage = 'Donor ID is missing.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.confirmService.open({
      title: 'Delete Donor?',
      message: `Are you sure you want to delete ${this.getDonorName(donor)}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      loadingText: 'Deleting...',
      icon: 'delete'
    }).subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.loading = true;
      this.confirmService.setLoading(true);

      this.donorService.delete(id).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.confirmService.setLoading(false);
          this.confirmService.close();

          this.donors = this.donors.filter(
            item => (item?._id || item?.id) !== id
          );

          this.successMessage =
            response?.message ||
            'Donor deleted successfully.';
        },
        error: (error: any) => {
          this.loading = false;
          this.confirmService.setLoading(false);
          this.confirmService.close();

          this.errorMessage =
            error?.error?.message ||
            'Failed to delete donor.';
        }
      });
    });
  }

  getDonorName(donor: any): string {
    return (
      donor?.userId?.name ||
      donor?.user?.name ||
      donor?.name ||
      'Unknown'
    );
  }

  getDonorEmail(donor: any): string {
    return (
      donor?.userId?.email ||
      donor?.user?.email ||
      donor?.email ||
      '—'
    );
  }

  getLastDonationDate(donor: any): string {
    if (!donor?.lastDonationDate) {
      return '—';
    }

    const date = new Date(donor.lastDonationDate);

    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleDateString();
  }

  getEligibilityClass(status: string): string {
    switch (status) {
      case 'Eligible':
        return 'available';

      case 'Deferred':
        return 'pending';

      default:
        return 'matched';
    }
  }

  getAvailabilityClass(status: string): string {
    return status === 'Available'
      ? 'available'
      : 'cancelled';
  }
}