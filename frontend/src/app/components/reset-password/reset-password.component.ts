import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="reset-page">
        <div class="card">
          <h2>Reset Password</h2>
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                [(ngModel)]="resetData.email" 
                name="email" 
                required
                (blur)="validateEmail()"
                [class.invalid]="emailError">
              <div *ngIf="emailError" class="field-error">{{ emailError }}</div>
            </div>
            <div class="form-group">
              <label>New Password * (5-9 chars, must include special character)</label>
              <div class="password-input-wrapper">
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  [(ngModel)]="resetData.newPassword" 
                  name="newPassword" 
                  required
                  (blur)="validatePassword()"
                  [class.invalid]="passwordError">
                <button 
                  type="button" 
                  class="toggle-password" 
                  (click)="togglePasswordVisibility()"
                  [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'">
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <div *ngIf="passwordError" class="field-error">{{ passwordError }}</div>
            </div>
            <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
            <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
            <div class="buttons">
              <button type="submit" class="btn btn-primary" [disabled]="!isFormValid()">Change Password</button>
              <button type="button" class="btn btn-secondary" (click)="goBack()">Back</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reset-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .card {
      max-width: 500px;
      width: 100%;
    }

    h2 {
      font-size: 32px;
      margin-bottom: 30px;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .buttons {
      display: flex;
      gap: 15px;
      margin-top: 20px;
    }

    .buttons button {
      flex: 1;
    }

    .field-error {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
      display: block;
    }

    input.invalid {
      border-color: #dc3545;
      border-width: 2px;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .password-input-wrapper {
      position: relative;
    }

    .password-input-wrapper input {
      width: 100%;
      padding-right: 45px;
    }

    .toggle-password {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      padding: 5px;
      color: #667eea;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-password:hover {
      opacity: 0.7;
    }
  `]
})
export class ResetPasswordComponent {
  resetData = {
    email: '',
    newPassword: ''
  };
  errorMessage = '';
  successMessage = '';
  emailError = '';
  passwordError = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validatePassword(): void {
    const password = this.resetData.newPassword || '';
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;
    
    if (!password) {
      this.passwordError = 'Password is required';
    } else if (password.length < 5) {
      this.passwordError = 'Password must be at least 5 characters';
    } else if (password.length > 9) {
      this.passwordError = 'Password must be at most 9 characters';
    } else if (!specialChars.test(password)) {
      this.passwordError = 'Password must contain at least one special character';
    } else {
      this.passwordError = '';
    }
  }

  validateEmail(): void {
    const email = this.resetData.email?.trim() || '';
    if (!email) {
      this.emailError = 'Email is required';
    } else if (!email.includes('@')) {
      this.emailError = 'Email must contain @ symbol';
    } else {
      this.emailError = '';
    }
  }

  isFormValid(): boolean {
    const email = this.resetData.email?.trim() || '';
    const password = this.resetData.newPassword || '';
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;
    
    // Validate all fields
    this.validateEmail();
    this.validatePassword();
    
    // Check if all validations pass
    return email.length > 0 && 
           email.includes('@') && 
           password.length >= 5 &&
           password.length <= 9 &&
           specialChars.test(password) &&
           !this.emailError &&
           !this.passwordError;
  }

  onSubmit() {
    // Re-validate before submit
    this.validateEmail();
    this.validatePassword();
    
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fix the validation errors before submitting';
      return;
    }

    this.errorMessage = '';
    this.authService.resetPassword(this.resetData).subscribe({
      next: (response) => {
        this.successMessage = 'Password reset successful! Redirecting to login...';
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Password reset failed';
        this.successMessage = '';
      }
    });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}

