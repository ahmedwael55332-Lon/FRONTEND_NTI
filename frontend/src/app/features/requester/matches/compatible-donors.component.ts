import { Component, OnInit } from '@angular/core';
import {
  BloodRequest,
  BloodRequestService
} from '../../../core/services/blood-request.service';

@Component({
  selector: 'app-compatible-donors',
  templateUrl: './compatible-donors.component.html',
  styleUrls: ['./compatible-donors.component.css']
})
export class CompatibleDonorsComponent implements OnInit {

  navItems: any[] = [
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
  selectedRequestId = '';

  matches: any[] = [];

  loadingRequests = false;
  loadingMatches = false;

  errorMessage = '';
  matchesError = '';

  constructor(
    private bloodRequestService: BloodRequestService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loadingRequests = true;
    this.errorMessage = '';

    this.bloodRequestService.getAll().subscribe({
      next: (response) => {
        this.loadingRequests = false;

        this.requests = response.bloodRequests || [];

        if (this.requests.length > 0) {
          this.selectedRequestId = this.requests[0]._id;
          this.loadMatches();
        }
      },

      error: (error: any) => {
        this.loadingRequests = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load your blood requests.';
      }
    });
  }

  onRequestChange(): void {
    if (!this.selectedRequestId) {
      this.matches = [];
      return;
    }

    this.loadMatches();
  }

  loadMatches(): void {
    if (!this.selectedRequestId) {
      return;
    }

    this.loadingMatches = true;
    this.matchesError = '';
    this.matches = [];

    this.bloodRequestService
      .getMatches(this.selectedRequestId)
      .subscribe({

        next: (response: any) => {
          this.loadingMatches = false;

          /*
           * The backend may return the matches in different
           * property names depending on its controller response.
           */
          this.matches =
            response?.matches ||
            response?.donors ||
            response?.compatibleDonors ||
            [];
        },

        error: (error: any) => {
          this.loadingMatches = false;

          this.matchesError =
            error?.error?.message ||
            'Failed to load compatible donors.';
        }

      });
  }

  get donorName(): string { return ''; }

  getDonorName(donor: any): string {
    return donor?.name || donor?.user?.name || donor?.userId?.name || 'Donor';
  }

  isDonorAvailable(donor: any): boolean {
    return donor?.isAvailable !== false && donor?.available !== false;
  }

  getDonorLocation(donor: any): string {
    return donor?.address || donor?.location || donor?.city || 'Location not provided';
  }

  get selectedRequest(): BloodRequest | undefined {
    return this.requests.find(
      request => request._id === this.selectedRequestId
    );
  }

}