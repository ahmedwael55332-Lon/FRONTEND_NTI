import { Component, OnInit } from '@angular/core';

import {
  DashboardNavItem
} from '../../../shared/dashboard-layout/dashboard-layout.component';

import {
  BloodUnit,
  BloodUnitService,
  CreateBloodUnit,
  BloodType,
  RhType,
  BloodUnitStatus,
  BloodUnitsResponse
} from '../../../core/services/blood-unit.service';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-blood-units',
  templateUrl: './blood-units.component.html',
  styleUrls: ['./blood-units.component.css']
})
export class BloodUnitsComponent implements OnInit {

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

  bloodUnits: BloodUnit[] = [];

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  showForm = false;

  editingUnit: BloodUnit | null = null;

  formData: CreateBloodUnit = {
    bloodType: 'A',
    rh: 'Positive',
    collectionDate: '',
    expirationDate: '',
    status: 'Available'
  };

  bloodTypes: BloodType[] = [
    'A',
    'B',
    'AB',
    'O'
  ];

  rhTypes: RhType[] = [
    'Positive',
    'Negative'
  ];

  statuses: BloodUnitStatus[] = [
    'Available',
    'Reserved',
    'Released',
    'Expired'
  ];

  constructor(
    private bloodUnitService: BloodUnitService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadBloodUnits();
  }

  loadBloodUnits(): void {

    this.loading = true;
    this.errorMessage = '';

    this.bloodUnitService.getAll().subscribe({

      next: (response: BloodUnitsResponse) => {

        this.loading = false;

        this.bloodUnits =
          response?.bloodUnits || [];

      },

      error: (error: any) => {

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load blood units.';

      }

    });
  }

  openCreateForm(): void {

    this.editingUnit = null;

    this.formData = {
      bloodType: 'A',
      rh: 'Positive',
      collectionDate: '',
      expirationDate: '',
      status: 'Available'
    };

    this.errorMessage = '';
    this.successMessage = '';

    this.showForm = true;
  }

  openEditForm(unit: BloodUnit): void {

    this.editingUnit = unit;

    this.formData = {
      bloodType: unit.bloodType,
      rh: unit.rh,
      collectionDate:
        this.formatDateForInput(unit.collectionDate),
      expirationDate:
        this.formatDateForInput(unit.expirationDate),
      status: unit.status
    };

    this.errorMessage = '';
    this.successMessage = '';

    this.showForm = true;
  }

  closeForm(): void {

    this.showForm = false;
    this.editingUnit = null;
    this.errorMessage = '';
  }

  saveBloodUnit(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.formData.bloodType ||
      !this.formData.rh ||
      !this.formData.collectionDate ||
      !this.formData.expirationDate
    ) {
      this.errorMessage =
        'Please fill in all required fields.';

      return;
    }

    const collectionDate =
      new Date(this.formData.collectionDate);

    const expirationDate =
      new Date(this.formData.expirationDate);

    if (
      expirationDate < collectionDate
    ) {
      this.errorMessage =
        'Expiration date must be after collection date.';

      return;
    }

    this.saving = true;

    if (this.editingUnit) {

      this.bloodUnitService
        .update(
          this.editingUnit._id,
          this.formData
        )
        .subscribe({

          next: (_response: any) => {

            this.saving = false;

            this.successMessage =
              'Blood unit updated successfully.';

            this.showForm = false;

            this.loadBloodUnits();
          },

          error: (error: any) => {

            this.saving = false;

            this.errorMessage =
              error?.error?.message ||
              'Failed to update blood unit.';

          }

        });

    } else {

      this.bloodUnitService
        .create(this.formData)
        .subscribe({

          next: (_response: any) => {

            this.saving = false;

            this.successMessage =
              'Blood unit created successfully.';

            this.showForm = false;

            this.loadBloodUnits();
          },

          error: (error: any) => {

            this.saving = false;

            this.errorMessage =
              error?.error?.message ||
              'Failed to create blood unit.';

          }

        });
    }
  }

  deleteBloodUnit(unit: BloodUnit): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.confirmService.open({
      title: 'Delete Blood Unit?',
      message: `Are you sure you want to delete the ${unit.bloodType} ${unit.rh} blood unit? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      loadingText: 'Deleting...',
      icon: 'delete'
    }).subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.confirmService.setLoading(true);

      this.bloodUnitService.delete(unit._id).subscribe({
        next: (_response: any) => {
          this.confirmService.setLoading(false);
          this.confirmService.close();

          this.bloodUnits = this.bloodUnits.filter(
            item => item._id !== unit._id
          );

          this.successMessage = 'Blood unit deleted successfully.';
        },
        error: (error: any) => {
          this.confirmService.setLoading(false);
          this.confirmService.close();

          this.errorMessage =
            error?.error?.message ||
            'Failed to delete blood unit.';
        }
      });
    });
  }

  releaseBloodUnit(unit: BloodUnit): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.confirmService.open({
      title: 'Release Blood Unit?',
      message: `Are you sure you want to release the ${unit.bloodType} ${unit.rh} blood unit?`,
      confirmText: 'Release',
      cancelText: 'Cancel',
      loadingText: 'Releasing...',
      icon: 'bloodtype'
    }).subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.confirmService.setLoading(true);

      this.bloodUnitService.release(unit._id).subscribe({
        next: (_response: any) => {
          this.confirmService.setLoading(false);
          this.confirmService.close();

          this.successMessage = 'Blood unit released successfully.';
          this.loadBloodUnits();
        },
        error: (error: any) => {
          this.confirmService.setLoading(false);
          this.confirmService.close();

          this.errorMessage =
            error?.error?.message ||
            'Failed to release blood unit.';
        }
      });
    });
  }

  getStatusClass(status: string): string {

    return status
      .toLowerCase()
      .replace(/\s+/g, '-');
  }

  formatDate(date: string): string {

    if (!date) {
      return '—';
    }

    return new Date(date)
      .toLocaleDateString();
  }

  private formatDateForInput(
    date: string
  ): string {

    if (!date) {
      return '';
    }

    const parsedDate = new Date(date);

    if (
      isNaN(parsedDate.getTime())
    ) {
      return '';
    }

    return parsedDate
      .toISOString()
      .split('T')[0];
  }
}