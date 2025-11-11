import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="login-page">
        <div class="card">
          <h2>Login</h2>
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Username</label>
              <input type="text" [(ngModel)]="credentials.username" name="username" required>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" [(ngModel)]="credentials.password" name="password" required>
            </div>
            <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
            <div class="buttons">
              <button type="submit" class="btn btn-primary">Login</button>
              <button type="button" class="btn btn-secondary" (click)="goBack()">Back</button>
            </div>
          </form>
          <div class="links">
            <a (click)="goToResetPassword()">Reset Password</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
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
  `]
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response.role === 'ADMIN' || response.role === 'EMPLOYEE') {
          this.router.navigate(['/admin-main']);
        } else {
          this.router.navigate(['/user-main']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Invalid credentials';
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}

