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
              <label>Username</label>
              <input type="text" [(ngModel)]="registerData.username" name="username" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="registerData.email" name="email" required>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" [(ngModel)]="registerData.password" name="password" required>
            </div>
            <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
            <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
            <div class="buttons">
              <button type="submit" class="btn btn-primary">Submit</button>
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
  `]
})
export class RegisterComponent {
  registerData = {
    username: '',
    email: '',
    password: ''
  };
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.register(this.registerData).subscribe({
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

