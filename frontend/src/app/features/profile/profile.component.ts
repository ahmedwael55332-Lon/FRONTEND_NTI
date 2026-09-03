import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  navItems: any[] = [];
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    role: [{ value: '', disabled: true }]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getMe().subscribe({
      next: (response: any) => {
        this.loading = false;
        const user = response?.user || response?.data?.user || response?.data || response;
        this.form.patchValue({
          name: user?.name || '',
          email: user?.email || '',
          role: user?.role || ''
        });
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Failed to load profile.';
      }
    });
  }

  saveChanges(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.updateMe({ name: this.form.get('name')?.value?.trim() }).subscribe({
      next: (response: any) => {
        this.saving = false;
        const user = response?.user || response?.data?.user || response?.data;
        if (user?.name) this.form.patchValue({ name: user.name });
        this.successMessage = response?.message || 'Profile updated successfully.';
      },
      error: (error: any) => {
        this.saving = false;
        this.errorMessage = error?.error?.message || 'Failed to update profile.';
      }
    });
  }
}
