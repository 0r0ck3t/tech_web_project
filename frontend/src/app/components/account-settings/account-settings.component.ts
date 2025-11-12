import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="navbar">
      <button class="menu-btn" (click)="toggleSidebar()">☰</button>
      <div class="navbar-brand">Account Settings</div>
      <div class="navbar-links">
        <button (click)="goBack()">Back</button>
      </div>
    </div>

    <app-sidebar [(isOpen)]="sidebarOpen"></app-sidebar>
    
    <div class="container">
      <div class="settings-page">
        <div class="card">
          <h2>Account Settings</h2>
          
          <!-- Password Verification Section -->
          <div *ngIf="!passwordVerified" class="verification-section">
            <h3>Verify Your Password</h3>
            <p class="verification-text">Please enter your current password to make changes to your account.</p>
            <form (ngSubmit)="verifyPassword()">
              <div class="form-group">
                <label>Current Password *</label>
                <div class="password-input-wrapper">
                  <input 
                    [type]="showVerifyPassword ? 'text' : 'password'" 
                    [(ngModel)]="verificationPassword" 
                    name="verificationPassword" 
                    required
                    placeholder="Enter your password">
                  <button 
                    type="button" 
                    class="toggle-password" 
                    (click)="toggleVerifyPasswordVisibility()"
                    [attr.aria-label]="showVerifyPassword ? 'Hide password' : 'Show password'">
                    {{ showVerifyPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                <div *ngIf="verificationError" class="field-error">{{ verificationError }}</div>
              </div>
              <button type="submit" class="btn btn-primary">Verify Password</button>
            </form>
          </div>
          
          <!-- Account Update Form (only shown after verification) -->
          <div *ngIf="passwordVerified">
            <form (ngSubmit)="updateAccount()">
              <div class="form-group">
                <label>Username *</label>
                <input 
                  type="text" 
                  [(ngModel)]="userData.username" 
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
                  [(ngModel)]="userData.email" 
                  name="email" 
                  required
                  (blur)="validateEmail()"
                  [class.invalid]="emailError">
                <div *ngIf="emailError" class="field-error">{{ emailError }}</div>
              </div>
              
              <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
              <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-primary" [disabled]="!isFormValid()">Update Account</button>
                <button type="button" class="btn btn-secondary" (click)="resetVerification()">Cancel</button>
              </div>
            </form>
          </div>
          
          <hr>
          
          <h3>Change Password</h3>
          <form (ngSubmit)="changePassword()">
            <div class="form-group">
              <label>Current Password</label>
              <div class="password-input-wrapper">
                <input 
                  [type]="showCurrentPassword ? 'text' : 'password'" 
                  [(ngModel)]="passwordData.currentPassword" 
                  name="currentPassword" 
                  required>
                <button 
                  type="button" 
                  class="toggle-password" 
                  (click)="toggleCurrentPasswordVisibility()"
                  [attr.aria-label]="showCurrentPassword ? 'Hide password' : 'Show password'">
                  {{ showCurrentPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label>New Password * (5-9 chars, must include special character)</label>
              <div class="password-input-wrapper">
                <input 
                  [type]="showNewPassword ? 'text' : 'password'" 
                  [(ngModel)]="passwordData.newPassword" 
                  name="newPassword" 
                  required
                  (blur)="validateNewPassword()"
                  [class.invalid]="newPasswordError">
                <button 
                  type="button" 
                  class="toggle-password" 
                  (click)="toggleNewPasswordVisibility()"
                  [attr.aria-label]="showNewPassword ? 'Hide password' : 'Show password'">
                  {{ showNewPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <div *ngIf="newPasswordError" class="field-error">{{ newPasswordError }}</div>
            </div>
            
            <div class="form-group">
              <label>Confirm New Password *</label>
              <div class="password-input-wrapper">
                <input 
                  [type]="showConfirmPassword ? 'text' : 'password'" 
                  [(ngModel)]="passwordData.confirmPassword" 
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
            
            <div *ngIf="passwordSuccess" class="success">{{ passwordSuccess }}</div>
            <div *ngIf="passwordError" class="error">{{ passwordError }}</div>
            
            <button type="submit" class="btn btn-primary" [disabled]="!isPasswordFormValid()">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      max-width: 600px;
      margin: 40px auto;
    }

    h2 {
      font-size: 32px;
      margin-bottom: 30px;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    h3 {
      font-size: 24px;
      margin: 30px 0 20px;
      color: #333;
    }

    hr {
      margin: 40px 0;
      border: none;
      border-top: 2px solid #eee;
    }

    .menu-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 5px 15px;
      color: #333;
    }

    .menu-btn:hover {
      color: #667eea;
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

    .verification-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border: 2px solid #e0e7ff;
    }

    .verification-text {
      color: #666;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .form-actions button {
      flex: 1;
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
export class AccountSettingsComponent implements OnInit {
  sidebarOpen = false;
  userData = {
    username: '',
    email: ''
  };
  originalUserData = {
    username: '',
    email: ''
  };
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  successMessage = '';
  errorMessage = '';
  passwordSuccess = '';
  passwordError = '';
  usernameError = '';
  emailError = '';
  newPasswordError = '';
  confirmPasswordError = '';
  passwordVerified = false;
  verificationPassword = '';
  verificationError = '';
  showVerifyPassword = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.updateUserData();
    
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(() => {
      this.updateUserData();
    });
  }

  updateUserData() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userData.username = user.username;
      this.userData.email = user.email;
      this.originalUserData.username = user.username;
      this.originalUserData.email = user.email;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleVerifyPasswordVisibility() {
    this.showVerifyPassword = !this.showVerifyPassword;
  }

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  verifyPassword() {
    if (!this.verificationPassword) {
      this.verificationError = 'Password is required';
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.verificationError = 'User not found';
      return;
    }

    // Verify password by attempting login
    this.authService.login({
      username: currentUser.username,
      password: this.verificationPassword
    }).subscribe({
      next: () => {
        this.passwordVerified = true;
        this.verificationError = '';
        this.verificationPassword = '';
      },
      error: () => {
        this.verificationError = 'Incorrect password. Please try again.';
        this.verificationPassword = '';
      }
    });
  }

  resetVerification() {
    this.passwordVerified = false;
    this.verificationPassword = '';
    this.verificationError = '';
    // Reset to original values
    this.userData.username = this.originalUserData.username;
    this.userData.email = this.originalUserData.email;
    this.errorMessage = '';
    this.successMessage = '';
  }

  validateUsername(): void {
    const username = this.userData.username?.trim() || '';
    if (!username) {
      this.usernameError = 'Username is required';
    } else {
      this.usernameError = '';
    }
  }

  validateEmail(): void {
    const email = this.userData.email?.trim() || '';
    if (!email) {
      this.emailError = 'Email is required';
    } else if (!email.includes('@')) {
      this.emailError = 'Email must contain @ symbol';
    } else {
      this.emailError = '';
    }
  }

  isFormValid(): boolean {
    const username = this.userData.username?.trim() || '';
    const email = this.userData.email?.trim() || '';
    
    // Validate all fields
    this.validateUsername();
    this.validateEmail();
    
    // Check if all validations pass
    return username.length > 0 && 
           email.length > 0 && 
           email.includes('@') &&
           !this.usernameError &&
           !this.emailError;
  }

  updateAccount() {
    // Check if password is verified
    if (!this.passwordVerified) {
      this.errorMessage = 'Please verify your password first';
      return;
    }

    // Check if anything actually changed
    if (this.userData.username === this.originalUserData.username && 
        this.userData.email === this.originalUserData.email) {
      this.errorMessage = 'No changes detected';
      return;
    }

    // Re-validate before submit
    this.validateUsername();
    this.validateEmail();
    
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fix the validation errors before submitting';
      return;
    }

    this.errorMessage = '';
    console.log('Updating account with:', this.userData);
    this.authService.updateAccount(this.userData).subscribe({
      next: (response) => {
        console.log('Update successful:', response);
        this.successMessage = 'Account information updated successfully!';
        this.errorMessage = '';
        // Update local data
        this.userData.username = response.username;
        this.userData.email = response.email;
        this.originalUserData.username = response.username;
        this.originalUserData.email = response.email;
        // Reset verification after successful update
        setTimeout(() => {
          this.successMessage = '';
          this.resetVerification();
        }, 3000);
      },
      error: (error) => {
        console.error('Update failed:', error);
        this.errorMessage = error.error?.message || error.message || 'Failed to update account';
        this.successMessage = '';
      }
    });
  }

  validateNewPassword(): void {
    const password = this.passwordData.newPassword || '';
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;
    
    if (!password) {
      this.newPasswordError = 'Password is required';
    } else if (password.length < 5) {
      this.newPasswordError = 'Password must be at least 5 characters';
    } else if (password.length > 9) {
      this.newPasswordError = 'Password must be at most 9 characters';
    } else if (!specialChars.test(password)) {
      this.newPasswordError = 'Password must contain at least one special character';
    } else {
      this.newPasswordError = '';
    }
    
    // Also validate confirm password if it has a value
    if (this.passwordData.confirmPassword) {
      this.validateConfirmPassword();
    }
  }

  validateConfirmPassword(): void {
    const confirmPassword = this.passwordData.confirmPassword || '';
    const newPassword = this.passwordData.newPassword || '';
    
    if (!confirmPassword) {
      this.confirmPasswordError = 'Please confirm your password';
    } else if (confirmPassword !== newPassword) {
      this.confirmPasswordError = 'Passwords do not match';
    } else {
      this.confirmPasswordError = '';
    }
  }

  isPasswordFormValid(): boolean {
    const newPassword = this.passwordData.newPassword || '';
    const confirmPassword = this.passwordData.confirmPassword || '';
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;
    
    // Validate all fields
    this.validateNewPassword();
    this.validateConfirmPassword();
    
    // Check if all validations pass
    return newPassword.length >= 5 &&
           newPassword.length <= 9 &&
           specialChars.test(newPassword) &&
           confirmPassword === newPassword &&
           !this.newPasswordError &&
           !this.confirmPasswordError;
  }

  changePassword() {
    // Re-validate before submit
    this.validateNewPassword();
    this.validateConfirmPassword();
    
    if (!this.isPasswordFormValid()) {
      this.passwordError = 'Please fix the validation errors before submitting';
      this.passwordSuccess = '';
      return;
    }
    
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.passwordError = 'Passwords do not match';
      this.passwordSuccess = '';
      return;
    }
    
    this.passwordError = '';

    this.http.post('http://localhost:8080/api/auth/reset-password', {
      email: this.userData.email,
      newPassword: this.passwordData.newPassword
    }).subscribe({
      next: () => {
        this.passwordSuccess = 'Password changed successfully!';
        this.passwordError = '';
        this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
        setTimeout(() => this.passwordSuccess = '', 3000);
      },
      error: () => {
        this.passwordError = 'Failed to change password';
        this.passwordSuccess = '';
      }
    });
  }

  goBack() {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'ADMIN' || user?.role === 'EMPLOYEE') {
      this.router.navigate(['/admin-main']);
    } else {
      this.router.navigate(['/user-main']);
    }
  }
}

