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
          
          <form (ngSubmit)="updateAccount()">
            <div class="form-group">
              <label>Username</label>
              <input type="text" [(ngModel)]="userData.username" name="username" required>
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="userData.email" name="email" required>
            </div>
            
            <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
            <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
            
            <button type="submit" class="btn btn-primary">Update Account</button>
          </form>
          
          <hr>
          
          <h3>Change Password</h3>
          <form (ngSubmit)="changePassword()">
            <div class="form-group">
              <label>Current Password</label>
              <input type="password" [(ngModel)]="passwordData.currentPassword" name="currentPassword" required>
            </div>
            
            <div class="form-group">
              <label>New Password</label>
              <input type="password" [(ngModel)]="passwordData.newPassword" name="newPassword" required>
            </div>
            
            <div class="form-group">
              <label>Confirm New Password</label>
              <input type="password" [(ngModel)]="passwordData.confirmPassword" name="confirmPassword" required>
            </div>
            
            <div *ngIf="passwordSuccess" class="success">{{ passwordSuccess }}</div>
            <div *ngIf="passwordError" class="error">{{ passwordError }}</div>
            
            <button type="submit" class="btn btn-primary">Change Password</button>
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
  `]
})
export class AccountSettingsComponent implements OnInit {
  sidebarOpen = false;
  userData = {
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
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  updateAccount() {
    console.log('Updating account with:', this.userData);
    this.authService.updateAccount(this.userData).subscribe({
      next: (response) => {
        console.log('Update successful:', response);
        this.successMessage = 'Account information updated successfully!';
        this.errorMessage = '';
        // Update local data
        this.userData.username = response.username;
        this.userData.email = response.email;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Update failed:', error);
        this.errorMessage = error.error?.message || error.message || 'Failed to update account';
        this.successMessage = '';
      }
    });
  }

  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.passwordError = 'Passwords do not match';
      this.passwordSuccess = '';
      return;
    }

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

