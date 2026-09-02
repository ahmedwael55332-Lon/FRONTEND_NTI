import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  isLoading: boolean = false;

  errorMessage: string | null = null;

  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public themeService: ThemeService,
    private toastService: ToastService,
    private router: Router,
    public languageService: LanguageService
  ) {}

  ngOnInit(): void {

    // If user is already logged in
    if (this.authService.token && this.authService.currentUserValue) {

      const role = this.authService.userRole;

      if (role === 'donor') {
        this.router.navigate(['/donor']);
      } else if (role === 'requester') {
        this.router.navigate(['/requester']);
      } else {
        this.router.navigate(['/admin']);
      }

      return;
    }

    // Register Form
    this.registerForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      role: [
        'donor',
        Validators.required
      ]
    });
  }

  // Form controls
  get f() {
    return this.registerForm.controls;
  }

  // Change role
  setRole(role: 'donor' | 'requester'): void {
    this.registerForm.patchValue({
      role: role
    });
  }

  // Show / Hide password
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Change dark/light mode
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // Change Arabic / English
  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  // Register
  onSubmit(): void {

    // Don't submit if form is invalid
    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formData = this.registerForm.value;

    this.authService.register(formData).subscribe({

      next: (res) => {

        // ------------------------------------------
        // DONOR
        // ------------------------------------------
        if (res.user?.role === 'donor') {

          this.isLoading = false;

          this.toastService.success(
            'Your account has been created! Please complete your donor profile.',
            'Welcome to Nuqat Dam'
          );

          /*
           * Redirect to the donor profile page
           * so the donor can fill in their real
           * blood type, Rh, and other data.
           */
          this.router.navigate(['/donor/profile']);

        }

        // ------------------------------------------
        // REQUESTER
        // ------------------------------------------
        else {

          this.isLoading = false;

          this.toastService.success(
            'Your account has been created successfully!',
            'Welcome to Nuqat Dam'
          );

          this.router.navigate(['/requester']);
        }
      },

      // ------------------------------------------
      // REGISTRATION ERROR
      // ------------------------------------------
      error: (err) => {

        this.isLoading = false;

        console.error(
          'Registration error:',
          err
        );

        this.errorMessage =
          err.error?.message ||
          'Registration failed. Please check your details.';

        this.toastService.error(
          this.errorMessage ||
          'Registration failed. Please check your details.',
          'Registration Error'
        );
      }

    });
  }
}