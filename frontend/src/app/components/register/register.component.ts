import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="register-page">
        <div class="card">
          <h2>Create Account</h2>
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Username *</label>
              <input 
                type="text" 
                [(ngModel)]="registerData.username" 
                name="username" 
                required
                (blur)="validateUsername()"
                [class.invalid]="usernameError">
              <div *ngIf="usernameError" class="field-error">{{ usernameError }}</div>
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                [(ngModel)]="registerData.email" 
                name="email" 
                required
                (blur)="validateEmail()"
                [class.invalid]="emailError">
              <div *ngIf="emailError" class="field-error">{{ emailError }}</div>
            </div>
            <div class="form-group">
              <label>Password * (5-9 chars, must include special character)</label>
              <div class="password-input-wrapper">
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  [(ngModel)]="registerData.password" 
                  name="password" 
                  required
                  (blur)="validatePassword()"
                  (input)="validateConfirmPassword()"
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
            <div class="form-group">
              <label>Confirm Password *</label>
              <div class="password-input-wrapper">
                <input 
                  [type]="showConfirmPassword ? 'text' : 'password'" 
                  [(ngModel)]="registerData.confirmPassword" 
                  name="confirmPassword" 
                  required
                  (blur)="validateConfirmPassword()"
                  [class.invalid]="confirmPasswordError">
                <button 
                  type="button" 
                  class="toggle-password" 
                  (click)="toggleConfirmPasswordVisibility()"
                  [attr.aria-label]="showConfirmPassword ? 'Hide password' : 'Show password'">
                  {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <div *ngIf="confirmPasswordError" class="field-error">{{ confirmPasswordError }}</div>
            </div>
            <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
            <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
            <div class="buttons">
              <button type="submit" class="btn btn-primary" [disabled]="!isFormValid()">Submit</button>
              <button type="button" class="btn btn-secondary" (click)="goBack()">Back to Start</button>
            </div>
          </form>
          <div class="links">
            <a (click)="goToLogin()">Already have an account? Log in</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page {
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

    .links {
      text-align: center;
      margin-top: 20px;
    }

    .links a {
      color: #667eea;
      cursor: pointer;
      text-decoration: none;
    }

    .links a:hover {
      text-decoration: underline;
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
export class RegisterComponent {
  registerData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  errorMessage = '';
  successMessage = '';
  usernameError = '';
  emailError = '';
  passwordError = '';
  confirmPasswordError = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validatePassword(): void {
    const password = this.registerData.password || '';
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
    
    // Also validate confirm password if it has a value
    if (this.registerData.confirmPassword) {
      this.validateConfirmPassword();
    }
  }

  validateConfirmPassword(): void {
    const confirmPassword = this.registerData.confirmPassword || '';
    const password = this.registerData.password || '';
    
    if (!confirmPassword) {
      this.confirmPasswordError = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      this.confirmPasswordError = 'Passwords do not match';
    } else {
      this.confirmPasswordError = '';
    }
  }

  validateUsername(): void {
    const username = this.registerData.username?.trim() || '';
    if (!username) {
      this.usernameError = 'Username is required';
    } else {
      this.usernameError = '';
    }
  }

  validateEmail(): void {
    const email = this.registerData.email?.trim() || '';
    if (!email) {
      this.emailError = 'Email is required';
    } else if (!email.includes('@')) {
      this.emailError = 'Email must contain @ symbol';
    } else {
      this.emailError = '';
    }
  }

  isFormValid(): boolean {
    const username = this.registerData.username?.trim() || '';
    const email = this.registerData.email?.trim() || '';
    const password = this.registerData.password || '';
    const confirmPassword = this.registerData.confirmPassword || '';
    
    // Validate all fields
    this.validateUsername();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();
    
    // Check if all validations pass
    return username.length > 0 && 
           email.length > 0 && 
           email.includes('@') && 
           password.length >= 5 &&
           password.length <= 9 &&
           /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password) &&
           confirmPassword === password &&
           !this.usernameError &&
           !this.emailError &&
           !this.passwordError &&
           !this.confirmPasswordError;
  }

  onSubmit() {
    // Re-validate before submit
    this.validateUsername();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();
    
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fix the validation errors before submitting';
      return;
    }

    // Double check passwords match
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.errorMessage = '';
    // Only send required fields to backend (exclude confirmPassword)
    const registrationData = {
      username: this.registerData.username,
      email: this.registerData.email,
      password: this.registerData.password
    };
    this.authService.register(registrationData).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Registration failed';
        this.successMessage = '';
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

