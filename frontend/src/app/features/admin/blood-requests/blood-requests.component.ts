import { Component, OnInit } from '@angular/core';

import {
  DashboardNavItem
} from '../../../shared/dashboard-layout/dashboard-layout.component';

import {
  BloodRequest,
  BloodRequestService,
  BloodRequestStatus,
  UpdateBloodRequest,
  BloodRequestsResponse
} from '../../../core/services/blood-request.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-blood-requests',
  templateUrl: './blood-requests.component.html',
  styleUrls: ['./blood-requests.component.css']
})
export class BloodRequestsComponent implements OnInit {

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

  bloodRequests: BloodRequest[] = [];

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  showForm = false;

  editingRequest: BloodRequest | null = null;

  formData: UpdateBloodRequest = {};

  statuses: BloodRequestStatus[] = [
    'pending',
    'matched',
    'completed',
    'cancelled'
  ];

  constructor(
    private bloodRequestService: BloodRequestService,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadBloodRequests();
  }

  loadBloodRequests(): void {

    this.loading = true;
    this.errorMessage = '';

    this.bloodRequestService
      .getAll()
      .subscribe({

        next: (response: BloodRequestsResponse) => {

          this.loading = false;

          this.bloodRequests =
            response?.bloodRequests || [];

        },

        error: (error: any) => {

          this.loading = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to load blood requests.';

        }

      });
  }

  openEditForm(request: BloodRequest): void {

    this.editingRequest = request;

    this.formData = {
      bloodType: request.bloodType,
      rh: request.rh,
      urgency: request.urgency,
      status: request.status
    };

    this.errorMessage = '';
    this.successMessage = '';

    this.showForm = true;
  }

  closeForm(): void {

    this.showForm = false;
    this.editingRequest = null;
    this.formData = {};
    this.errorMessage = '';
  }

  saveRequest(): void {

    if (!this.editingRequest) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.status) {

      this.errorMessage =
        'Please select a status.';

      return;
    }

    this.saving = true;

    this.bloodRequestService
      .update(
        this.editingRequest._id,
        this.formData
      )
      .subscribe({

        next: (_response: any) => {

          this.saving = false;

          this.successMessage =
            'Blood request updated successfully.';

          this.showForm = false;
          this.editingRequest = null;

          this.loadBloodRequests();
        },

        error: (error: any) => {

          this.saving = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to update blood request.';

        }

      });
  }

  deleteRequest(request: BloodRequest): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.confirmService.open({
      title: 'Delete Blood Request?',
      message: `Are you sure you want to delete the ${request.bloodType} ${request.rh} blood request? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      loadingText: 'Deleting...',
      icon: 'delete'
    }).subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.confirmService.setLoading(true);

      this.bloodRequestService.delete(request._id).subscribe({
        next: (_response: any) => {
          this.confirmService.setLoading(false);
          this.confirmService.close();

          this.bloodRequests = this.bloodRequests.filter(
            item => item._id !== request._id
          );

          this.successMessage = 'Blood request deleted successfully.';
        },
        error: (error: any) => {
          this.confirmService.setLoading(false);
          this.confirmService.close();

          this.errorMessage =
            error?.error?.message ||
            'Failed to delete blood request.';
        }
      });
    });
  }

  viewMatches(request: BloodRequest): void {

    this.errorMessage = '';
    this.successMessage = '';

    this.bloodRequestService
      .getMatches(request._id)
      .subscribe({

        next: (response: any) => {

          const count =
            response?.count ?? 0;

          this.toastService.success(
            `Compatible donors found: ${count}`,
            'Matches Found'
          );
        },

        error: (error: any) => {

          this.errorMessage =
            error?.error?.message ||
            'Failed to find compatible donors.';

        }

      });
  }

  getStatusClass(status: string): string {

    return status
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  getUrgencyClass(urgency: string): string {

    return urgency
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  formatDate(date?: string): string {

    if (!date) {
      return '—';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return '—';
    }

    return parsedDate.toLocaleDateString();
  }
}