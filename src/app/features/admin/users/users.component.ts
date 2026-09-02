import { Component, OnInit } from '@angular/core';
import { DashboardNavItem } from '../../../shared/dashboard-layout/dashboard-layout.component';
import { UserService } from '../../../core/services/user.service';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

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

  users: any[] = [];

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  showForm = false;
  editingUser: any = null;

  form = {
    name: '',
    email: '',
    password: '',
    role: 'requester'
  };

  constructor(
    private userService: UserService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getAll().subscribe({

      next: (response: any) => {
        this.loading = false;

        this.users =
          response?.users ||
          response?.data?.users ||
          response?.data ||
          [];

      },

      error: (error: any) => {
        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load users.';
      }

    });
  }

  openCreateForm(): void {
    this.editingUser = null;

    this.form = {
      name: '',
      email: '',
      password: '',
      role: 'requester'
    };

    this.errorMessage = '';
    this.successMessage = '';
    this.showForm = true;
  }

  openEditForm(user: any): void {
    this.editingUser = user;

    this.form = {
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'requester'
    };

    this.errorMessage = '';
    this.successMessage = '';
    this.showForm = true;
  }

  closeForm(): void {
    if (this.saving) {
      return;
    }

    this.showForm = false;
    this.editingUser = null;
  }

  saveUser(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.name.trim() || !this.form.email.trim()) {
      this.errorMessage = 'Name and email are required.';
      return;
    }

    if (!this.editingUser && !this.form.password) {
      this.errorMessage = 'Password is required.';
      return;
    }

    this.saving = true;

    const payload: any = {
      name: this.form.name.trim(),
      email: this.form.email.trim().toLowerCase(),
      role: this.form.role
    };

    if (this.form.password) {
      payload.password = this.form.password;
    }

    // Create
    if (!this.editingUser) {

      this.userService.create(payload).subscribe({

        next: () => {
          this.saving = false;
          this.showForm = false;

          this.successMessage =
            'User created successfully.';

          this.loadUsers();
        },

        error: (error: any) => {
          this.saving = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to create user.';
        }

      });

      return;
    }

    // Update
    this.userService
      .update(this.editingUser.id || this.editingUser._id, payload)
      .subscribe({

        next: () => {
          this.saving = false;
          this.showForm = false;

          this.successMessage =
            'User updated successfully.';

          this.loadUsers();
        },

        error: (error: any) => {
          this.saving = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to update user.';
        }

      });
  }

  deleteUser(user: any): void {
    const id = user.id || user._id;

    if (!id) {
      this.errorMessage = 'User ID is missing.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.confirmService.open({
      title: 'Delete User?',
      message: `Are you sure you want to delete ${user.name || 'this user'}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      loadingText: 'Deleting...',
      icon: 'delete'
    }).subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.loading = true;
      this.confirmService.setLoading(true);

      this.userService.delete(id).subscribe({
        next: () => {
          this.loading = false;
          this.confirmService.setLoading(false);
          this.confirmService.close();

          this.users = this.users.filter(
            item => (item.id || item._id) !== id
          );

          this.successMessage = 'User deleted successfully.';
        },
        error: (error: any) => {
          this.loading = false;
          this.confirmService.setLoading(false);
          this.confirmService.close();

          this.errorMessage =
            error?.error?.message ||
            'Failed to delete user.';
        }
      });
    });
  }
}
