import { Component, OnInit } from '@angular/core';
import {
  BloodRequest,
  BloodRequestService
} from '../../../core/services/blood-request.service';
import { DashboardNavItem } from '../../../shared/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-requester-blood-requests',
  templateUrl: './requester-blood-requests.component.html',
  styleUrls: ['./requester-blood-requests.component.css']
})
export class RequesterBloodRequestsComponent implements OnInit {

  navItems: DashboardNavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/requester'
    },
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

  loading = false;
  errorMessage = '';

  constructor(
    private bloodRequestService: BloodRequestService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.errorMessage = '';

    this.bloodRequestService.getAll().subscribe({
      next: (response) => {
        this.requests = response.bloodRequests || [];
        this.loading = false;
      },

      error: (error: any) => {
        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load your blood requests.';
      }
    });
  }
}