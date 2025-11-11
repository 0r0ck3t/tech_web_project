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
              <label>Email</label>
              <input type="email" [(ngModel)]="resetData.email" name="email" required>
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input type="password" [(ngModel)]="resetData.newPassword" name="newPassword" required>
            </div>
            <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
            <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
            <div class="buttons">
              <button type="submit" class="btn btn-primary">Change Password</button>
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
  `]
})
export class ResetPasswordComponent {
  resetData = {
    email: '',
    newPassword: ''
  };
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
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

