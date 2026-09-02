import { Component, OnInit } from '@angular/core';
import { DashboardNavItem } from '../../../shared/dashboard-layout/dashboard-layout.component';
import { DashboardService } from '../../../core/services/dashboard.service';
import { BloodRequest, BloodRequestService } from '../../../core/services/blood-request.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  navItems: DashboardNavItem[] = [
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

  loading = false;
  errorMessage = '';

  availableBloodUnits = 0;
  pendingRequests = 0;
  completedRequests = 0;

  bloodUnitDistribution: any[] = [];
  allRequests: BloodRequest[] = [];
  recentRequests: BloodRequest[] = [];
  totalRequests = 0;
  emergencyRequests = 0;
  matchedRequests = 0;
  cancelledRequests = 0;
  completionRate = 0;
  filteredDistribution: any[] = [];


  constructor(
    private dashboardService: DashboardService,
    private bloodRequestService: BloodRequestService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadRequestsAnalytics();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.getSummary().subscribe({

      next: (response: any) => {
        this.loading = false;

        const data = response?.data || response;

        this.availableBloodUnits =
          data?.availableBloodUnits ??
          data?.availableUnits ??
          data?.bloodUnitsAvailable ??
          0;

        this.pendingRequests =
          data?.pendingRequests ??
          data?.pendingBloodRequests ??
          0;

        this.completedRequests =
          data?.completedRequests ??
          data?.completedBloodRequests ??
          0;

        this.bloodUnitDistribution =
          data?.bloodUnitDistribution ||
          data?.distribution ||
          [];
        this.normalizeDistribution();
      },

      error: (error: any) => {
        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load dashboard summary.';
      }

    });
  }

  loadRequestsAnalytics(): void {
    this.bloodRequestService.getAll().subscribe({
      next: (response: any) => {
        const requests: BloodRequest[] = response?.bloodRequests || response?.data || [];
        this.allRequests = requests;
        this.recentRequests = [...requests]
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 6);
        this.totalRequests = requests.length;
        this.emergencyRequests = requests.filter(r => r.urgency === 'emergency').length;
        this.matchedRequests = requests.filter(r => r.status === 'matched').length;
        this.cancelledRequests = requests.filter(r => r.status === 'cancelled').length;
        this.completionRate = this.totalRequests ? Math.round((requests.filter(r => r.status === 'completed').length / this.totalRequests) * 100) : 0;
      },
      error: () => {}
    });
  }

  normalizeDistribution(): void {
    const max = Math.max(...this.bloodUnitDistribution.map(item => Number(item?.count ?? item?.quantity ?? item?.total ?? 0)), 0);
    this.filteredDistribution = this.bloodUnitDistribution.map(item => ({
      ...item,
      percentage: Number(item?.percentage ?? (max ? ((Number(item?.count ?? item?.quantity ?? item?.total ?? 0) / max) * 100) : 0))
    }));
  }

  getStatusCount(status: string): number {
    return this.allRequests.filter(r => r.status === status).length;
  }

  getStatusPercent(status: string): number {
    return this.totalRequests ? Math.round((this.getStatusCount(status) / this.totalRequests) * 100) : 0;
  }

  getUrgencyClass(urgency: string): string {
    return urgency?.toLowerCase() || '';
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase() || '';
  }

}