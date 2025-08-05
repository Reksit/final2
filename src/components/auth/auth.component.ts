import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest, RegisterRequest, ResendCodeRequest, VerifyEmailRequest } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  template: `
    <div class="auth-container">
      <app-notification></app-notification>
      
      <!-- Centered Auth Forms -->
      <div class="auth-forms-section-centered">
        <div class="auth-forms-container">
          <div class="auth-card">
            <!-- Logo -->
            <div class="auth-logo">
              <div class="auth-brand-icon">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h1 class="auth-brand-title">Task Manager</h1>
            </div>

            <!-- Tab Navigation -->
            <div class="auth-tab-navigation">
              <button 
                class="auth-tab-button"
                [class.active]="currentMode === 'login'"
                (click)="setMode('login')">
                Sign In
              </button>
              <button 
                class="auth-tab-button"
                [class.active]="currentMode === 'register'"
                (click)="setMode('register')">
                Sign Up
              </button>
              <button 
                class="auth-tab-button"
                [class.active]="currentMode === 'verify'"
                (click)="setMode('verify')"
                *ngIf="showVerifyTab">
                Verify
              </button>
            </div>

            <!-- Login Form -->
            <div *ngIf="currentMode === 'login'">
              <div class="auth-form-header">
                <h2 class="auth-form-title">Welcome back</h2>
                <p class="auth-form-subtitle">Sign in to your account</p>
              </div>
              
              <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="auth-form">
                <div class="auth-form-group">
                  <label for="loginEmail" class="auth-form-label">Email Address</label>
                  <div class="auth-input-container">
                    <div class="auth-input-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="loginEmail"
                      class="auth-form-input"
                      [(ngModel)]="loginData.email"
                      name="email"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div class="auth-form-group">
                  <label for="loginPassword" class="auth-form-label">Password</label>
                  <div class="auth-input-container">
                    <div class="auth-input-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <input
                      [type]="showLoginPassword ? 'text' : 'password'"
                      id="loginPassword"
                      class="auth-form-input"
                      [(ngModel)]="loginData.password"
                      name="password"
                      required
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      class="auth-password-toggle"
                      (click)="toggleLoginPasswordVisibility()"
                    >
                      <svg *ngIf="!showLoginPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <svg *ngIf="showLoginPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div *ngIf="errorMessage" class="auth-error-message">
                  <div class="auth-error-icon">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="auth-error-text">{{ errorMessage }}</span>
                </div>

                <button
                  type="submit"
                  class="auth-submit-button"
                  [disabled]="!loginForm.valid || isLoading"
                >
                  <span *ngIf="isLoading" class="auth-loading-spinner">
                    <div class="auth-spinner"></div>
                    Signing in...
                  </span>
                  <span *ngIf="!isLoading">Sign In</span>
                </button>
              </form>
            </div>

            <!-- Register Form -->
            <div *ngIf="currentMode === 'register'">
              <div class="auth-form-header">
                <h2 class="auth-form-title">Create your account</h2>
                <p class="auth-form-subtitle">Start managing your tasks</p>
              </div>
              
              <form (ngSubmit)="onRegister()" #registerForm="ngForm" class="auth-form">
                <div class="auth-form-group">
                  <label for="registerUsername" class="auth-form-label">Username</label>
                  <div class="auth-input-container">
                    <div class="auth-input-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="registerUsername"
                      class="auth-form-input"
                      [(ngModel)]="registerData.username"
                      name="username"
                      required
                      placeholder="Choose a username"
                    />
                  </div>
                </div>

                <div class="auth-form-group">
                  <label for="registerEmail" class="auth-form-label">Email Address</label>
                  <div class="auth-input-container">
                    <div class="auth-input-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="registerEmail"
                      class="auth-form-input"
                      [(ngModel)]="registerData.email"
                      name="email"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div class="auth-form-group">
                  <label for="registerPassword" class="auth-form-label">Password</label>
                  <div class="auth-input-container">
                    <div class="auth-input-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <input
                      [type]="showRegisterPassword ? 'text' : 'password'"
                      id="registerPassword"
                      class="auth-form-input"
                      [(ngModel)]="registerData.password"
                      name="password"
                      required
                      placeholder="Create a password"
                      (input)="validatePassword()"
                    />
                    <button
                      type="button"
                      class="auth-password-toggle"
                      (click)="toggleRegisterPasswordVisibility()"
                    >
                      <svg *ngIf="!showRegisterPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <svg *ngIf="showRegisterPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Password Requirements -->
                  <div class="auth-password-requirements" *ngIf="!isPasswordValid && registerData.password">
                    <div class="auth-requirements-container">
                      <div class="auth-requirements-header">
                        <div class="auth-requirements-icon">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div class="auth-requirements-content">
                          <p class="auth-requirements-title">Password requirements:</p>
                          <ul class="auth-requirements-list">
                            <li class="auth-requirement-item">
                              <span class="auth-requirement-status" [class.valid]="registerData.password.length >= 8" [class.invalid]="registerData.password.length < 8">
                                {{ registerData.password.length >= 8 ? '✓' : '✗' }}
                              </span>
                              <span>At least 8 characters</span>
                            </li>
                            <li class="auth-requirement-item">
                              <span class="auth-requirement-status" [class.valid]="hasUpperCase(registerData.password)" [class.invalid]="!hasUpperCase(registerData.password)">
                                {{ hasUpperCase(registerData.password) ? '✓' : '✗' }}
                              </span>
                              <span>One uppercase letter</span>
                            </li>
                            <li class="auth-requirement-item">
                              <span class="auth-requirement-status" [class.valid]="hasSpecialCharacter(registerData.password)" [class.invalid]="!hasSpecialCharacter(registerData.password)">
                                {{ hasSpecialCharacter(registerData.password) ? '✓' : '✗' }}
                              </span>
                              <span>One special character</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div *ngIf="errorMessage" class="auth-error-message">
                  <div class="auth-error-icon">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="auth-error-text">{{ errorMessage }}</span>
                </div>

                <button
                  type="submit"
                  class="auth-submit-button"
                  [disabled]="!registerForm.valid || !isPasswordValid || isLoading"
                >
                  <span *ngIf="isLoading" class="auth-loading-spinner">
                    <div class="auth-spinner"></div>
                    Creating account...
                  </span>
                  <span *ngIf="!isLoading">Create Account</span>
                </button>
              </form>
            </div>

            <!-- Email Verification Form -->
            <div *ngIf="currentMode === 'verify'">
              <div class="auth-verification-container">
                <div class="auth-verification-icon-container">
                  <svg class="auth-verification-icon w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 class="auth-verification-title">Verify Your Email</h3>
                <p class="auth-verification-subtitle">We've sent a 4-digit verification code to:</p>
                <p class="auth-verification-email">{{ pendingEmail }}</p>
                <p class="auth-verification-note">Check your inbox and enter the code below to complete your registration.</p>
                <p class="auth-verification-sender">📨 Check your email inbox</p>
              </div>

              <form (ngSubmit)="onVerifyEmail()" #verifyForm="ngForm" class="auth-form">
                <div class="auth-form-group">
                  <label for="verificationCode" class="auth-form-label">Verification Code</label>
                  <input
                    type="text"
                    id="verificationCode"
                    class="auth-verification-input"
                    [(ngModel)]="verifyData.verificationCode"
                    name="verificationCode"
                    required
                    placeholder="0000"
                    maxlength="4"
                    pattern="[0-9]{4}"
                  />
                </div>

                <div *ngIf="errorMessage" class="auth-error-message">
                  <div class="auth-error-icon">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="auth-error-text">{{ errorMessage }}</span>
                </div>

                <button
                  type="submit"
                  class="auth-submit-button"
                  [disabled]="!verifyForm.valid || isLoading"
                >
                  <span *ngIf="isLoading" class="auth-loading-spinner">
                    <div class="auth-spinner"></div>
                    Verifying...
                  </span>
                  <span *ngIf="!isLoading">Verify Email</span>
                </button>

                <div class="auth-resend-section">
                  <p class="auth-resend-text">Didn't receive the code?</p>
                  <button
                    type="button"
                    class="auth-resend-button"
                    (click)="resendCode()"
                    [disabled]="isResending || resendCooldown > 0"
                  >
                    <span *ngIf="isResending" class="auth-loading-spinner">
                      <div class="auth-spinner"></div>
                      Sending...
                    </span>
                    <span *ngIf="!isResending">
                      {{ resendCooldown > 0 ? 'Resend in ' + resendCooldown + 's' : 'Resend Code' }}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AuthComponent {
  currentMode: 'login' | 'register' | 'verify' = 'login';
  showVerifyTab = false;
  pendingEmail = '';
  isLoading = false;
  isResending = false;
  resendCooldown = 0;
  errorMessage = '';
  isPasswordValid = true;
  showLoginPassword = false;
  showRegisterPassword = false;

  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  registerData: RegisterRequest = {
    username: '',
    email: '',
    password: ''
  };

  verifyData: VerifyEmailRequest = {
    email: '',
    verificationCode: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  hasSpecialCharacter(password: string): boolean {
    return /[!@#$%^&*(),.?\":{}|<>]/.test(password);
  }

  hasUpperCase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  setMode(mode: 'login' | 'register' | 'verify') {
    this.currentMode = mode;
    this.errorMessage = '';
  }

  toggleLoginPasswordVisibility() {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleRegisterPasswordVisibility() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  validatePassword() {
    this.isPasswordValid = this.authService.validatePassword(this.registerData.password);
  }

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notificationService.addNotification({
          title: 'Success',
          message: 'Login successful! Welcome back.',
          type: 'success'
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.notificationService.addNotification({
          title: 'Login Failed',
          message: this.errorMessage,
          type: 'error'
        });
      }
    });
  }

  onRegister() {
    this.isLoading = true;
    this.errorMessage = '';
    
    if (!this.isPasswordValid) {
      this.errorMessage = 'Please ensure password meets requirements';
      this.isLoading = false;
      return;
    }

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notificationService.addNotification({
          title: 'Success',
          message: 'Registration successful! Please check your email for verification.',
          type: 'success'
        });
        
        this.pendingEmail = this.registerData.email;
        this.verifyData.email = this.registerData.email;
        this.showVerifyTab = true;
        this.setMode('verify');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.notificationService.addNotification({
          title: 'Registration Failed',
          message: this.errorMessage,
          type: 'error'
        });
      }
    });
  }

  onVerifyEmail() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.verifyEmail(this.verifyData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notificationService.addNotification({
          title: 'Email Verified',
          message: 'Your email has been verified successfully!',
          type: 'success'
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Verification failed. Please try again.';
        this.notificationService.addNotification({
          title: 'Verification Failed',
          message: this.errorMessage,
          type: 'error'
        });
      }
    });
  }

  resendCode() {
    this.isResending = true;
    
    const resendData: ResendCodeRequest = {
      email: this.pendingEmail
    };

    this.authService.resendVerificationCode(resendData).subscribe({
      next: () => {
        this.isResending = false;
        this.notificationService.addNotification({
          title: 'Code Sent',
          message: 'A new verification code has been sent to your email.',
          type: 'success'
        });
        
        // Start cooldown
        this.resendCooldown = 60;
        const countdown = setInterval(() => {
          this.resendCooldown--;
          if (this.resendCooldown <= 0) {
            clearInterval(countdown);
          }
        }, 1000);
      },
      error: (error) => {
        this.isResending = false;
        this.notificationService.addNotification({
          title: 'Resend Failed',
          message: error.error?.message || 'Failed to resend verification code.',
          type: 'error'
        });
      }
    });
  }
}
