import { Component, OnInit } from '@angular/core';

import {
  BloodRequest,
  BloodRequestService
} from '../../../core/services/blood-request.service';

import { DashboardNavItem } from '../../../shared/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-requester-dashboard',
  templateUrl: './requester-dashboard.component.html',
  styleUrls: ['./requester-dashboard.component.css']
})
export class RequesterDashboardComponent implements OnInit {

  navItems: DashboardNavItem[] = [
    {
      label: 'My Requests',
      icon: 'assignment',
      route: '/requester/blood-requests'
    },
    {
      label: 'Create Request',
      icon: 'add_circle',
      route: '/requester/blood-requests/create'
    },
    {
      label: 'Compatible Donors',
      icon: 'group',
      route: '/requester/matches'
    }
  ];

  requests: BloodRequest[] = [];
  filterStatus = 'all';
  filterUrgency = 'all';

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  constructor(
    private bloodRequestService: BloodRequestService
  ) {}

  loadRequests(): void {

    this.loading = true;
    this.errorMessage = '';

    this.bloodRequestService.getAll().subscribe({

      next: (response: any) => {

        this.loading = false;

        this.requests =
          response?.bloodRequests ||
          response?.data ||
          [];

      },

      error: (error: any) => {

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load blood requests.';

      }

    });
  }

  get filteredRequests(): BloodRequest[] {
    return this.requests.filter(request =>
      (this.filterStatus === 'all' || request.status === this.filterStatus) &&
      (this.filterUrgency === 'all' || request.urgency === this.filterUrgency)
    );
  }

  get recentRequests(): BloodRequest[] {
    return this.filteredRequests.slice(0, 5);
  }

  get emergencyCount(): number { return this.requests.filter(r => r.urgency === 'emergency').length; }
  get pendingCount(): number { return this.requests.filter(r => r.status === 'pending').length; }
  get matchedCount(): number { return this.requests.filter(r => r.status === 'matched').length; }
  get completedCount(): number { return this.requests.filter(r => r.status === 'completed').length; }

  getStatusClass(status: string): string {
    return status?.toLowerCase() || '';
  }

  getUrgencyClass(urgency: string): string {
    return urgency?.toLowerCase() || '';
  }
}