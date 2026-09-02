import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  returnUrl: string = '';

  private getRoleHome(role: string | null): string {
    if (role === 'admin') return '/admin';
    if (role === 'donor') return '/donor';
    if (role === 'requester') return '/requester';
    return '/';
  }

  private getSafeReturnUrl(role: string | null): string {
    const url = this.returnUrl;
    if (!url || !url.startsWith('/') || url.startsWith('//')) {
      return this.getRoleHome(role);
    }

    if (role === 'admin' && url.startsWith('/admin')) return url;
    if (role === 'donor' && url.startsWith('/donor')) return url;
    if (role === 'requester' && url.startsWith('/requester')) return url;

    return this.getRoleHome(role);
  }
  showPassword: boolean = false;

  showForgotModal: boolean = false;
  forgotStep: 'email' | 'code' | 'success' = 'email';
  forgotEmail: string = '';
  forgotCode: string = '';
  forgotNewPassword: string = '';
  forgotLoading: boolean = false;
  forgotMessage: string = '';
  forgotError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public themeService: ThemeService,
    public languageService: LanguageService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  ngOnInit(): void {
    if (this.authService.token && this.authService.currentUserValue) {
      const role = this.authService.userRole;
      if (role === 'donor') {
        this.router.navigate(['/donor']);
      } else if (role === 'requester') {
        this.router.navigate(['/requester']);
      } else {
        this.router.navigate(['/admin']);
      }
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.success(`Welcome back, ${res.user?.name}!`, 'Login Successful');

        this.router.navigate([this.getSafeReturnUrl(res.user?.role || null)]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid email or password. Please try again.';
        this.toastService.error(this.errorMessage || 'Login failed', 'Authentication Error');
      }
    });
  }

  fillDemo(role: 'admin' | 'donor' | 'requester'): void {
    if (role === 'admin') {
      this.loginForm.patchValue({ email: 'admin@nuqatdam.com', password: 'password123' });
    } else if (role === 'donor') {
      this.loginForm.patchValue({ email: 'donor@nuqatdam.com', password: 'password123' });
    } else {
      this.loginForm.patchValue({ email: 'requester@nuqatdam.com', password: 'password123' });
    }
  }

  openForgotModal(): void {
    this.showForgotModal = true;
    this.forgotStep = 'email';
    this.forgotEmail = this.loginForm.value.email || '';
    this.forgotCode = '';
    this.forgotNewPassword = '';
    this.forgotMessage = '';
    this.forgotError = '';
  }

  closeForgotModal(): void {
    this.showForgotModal = false;
  }

  sendRecoveryCode(): void {
    if (!this.forgotEmail.trim()) {
      this.forgotError = 'Please enter your email address.';
      return;
    }
    this.forgotLoading = true;
    this.forgotError = '';

    this.authService.forgotPassword(this.forgotEmail.trim()).subscribe({
      next: (res) => {
        this.forgotLoading = false;
        this.forgotMessage = res.message;
        if (res.resetToken) this.forgotCode = res.resetToken;
        this.forgotStep = 'code';
        this.toastService.success('Recovery code generated!', 'Check Email');
      },
      error: (err) => {
        this.forgotLoading = false;
        this.forgotError = err.error?.message || 'Failed to send recovery code.';
      }
    });
  }

  confirmResetPassword(): void {
    if (!this.forgotCode.trim() || !this.forgotNewPassword.trim()) {
      this.forgotError = 'Recovery code and new password are required.';
      return;
    }
    if (this.forgotNewPassword.length < 6) {
      this.forgotError = 'New password must be at least 6 characters.';
      return;
    }
    this.forgotLoading = true;
    this.forgotError = '';

    this.authService.resetPassword({
      email: this.forgotEmail.trim(),
      token: this.forgotCode.trim(),
      newPassword: this.forgotNewPassword
    }).subscribe({
      next: (res) => {
        this.forgotLoading = false;
        this.forgotStep = 'success';
        this.forgotMessage = res.message;
        this.toastService.success(res.message, 'Password Reset');
      },
      error: (err) => {
        this.forgotLoading = false;
        this.forgotError = err.error?.message || 'Failed to reset password.';
      }
    });
  }
}
