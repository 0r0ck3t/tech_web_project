import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="start-page">
        <div class="card">
          <h1>Welcome to Disney Characters</h1>
          <p>Explore the magical world of Disney characters</p>
          <div class="buttons">
            <button class="btn btn-primary" (click)="goToLogin()">Log In</button>
            <button class="btn btn-secondary" (click)="goToSignUp()">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .start-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .card {
      text-align: center;
      max-width: 500px;
      width: 100%;
    }

    h1 {
      font-size: 36px;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      font-size: 18px;
      color: #666;
      margin-bottom: 40px;
    }

    .buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
    }

    .btn {
      flex: 1;
    }
  `]
})
export class StartPageComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSignUp() {
    this.router.navigate(['/register']);
  }
}

