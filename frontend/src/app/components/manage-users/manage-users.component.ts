import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
}

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="navbar">
      <button class="menu-btn" (click)="toggleSidebar()">☰</button>
      <div class="navbar-brand">Manage Users</div>
      <div class="navbar-links">
        <button (click)="goBack()">Back</button>
      </div>
    </div>

    <app-sidebar [(isOpen)]="sidebarOpen"></app-sidebar>
    
    <div class="container">
      <h1>User Management</h1>
      
      <div *ngIf="loading" class="loading">Loading users...</div>
      
      <div class="users-table" *ngIf="!loading">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>
                <select [(ngModel)]="user.role" (change)="updateUserRole(user)" class="role-select">
                  <option value="USER">USER</option>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td>
                <span class="status-badge" [class.active]="user.enabled">
                  {{ user.enabled ? 'Active' : 'Disabled' }}
                </span>
              </td>
              <td>
                <button class="btn-small" (click)="toggleUserStatus(user)">
                  {{ user.enabled ? 'Disable' : 'Enable' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div *ngIf="successMessage" class="success message">{{ successMessage }}</div>
      <div *ngIf="errorMessage" class="error message">{{ errorMessage }}</div>
    </div>
  `,
  styles: [`
    h1 {
      text-align: center;
      color: white;
      font-size: 42px;
      margin: 40px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .users-table {
      background: white;
      border-radius: 12px;
      padding: 20px;
      overflow-x: auto;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: #667eea;
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: 600;
    }

    td {
      padding: 15px;
      border-bottom: 1px solid #eee;
    }

    tr:hover {
      background: #f8f9fa;
    }

    .role-select {
      padding: 8px 12px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
    }

    .role-select:focus {
      outline: none;
      border-color: #667eea;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      background: #dc3545;
      color: white;
    }

    .status-badge.active {
      background: #28a745;
    }

    .btn-small {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background: #6c757d;
      color: white;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-small:hover {
      background: #5a6268;
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

    .message {
      text-align: center;
      padding: 15px;
      margin: 20px 0;
      border-radius: 6px;
      font-weight: 600;
    }
  `]
})
export class ManageUsersComponent implements OnInit {
  sidebarOpen = false;
  users: User[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  loadUsers() {
    this.http.get<User[]>('http://localhost:8080/api/admin/users').subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load users';
        this.loading = false;
      }
    });
  }

  updateUserRole(user: User) {
    this.http.put(`http://localhost:8080/api/admin/users/${user.id}/role`, { role: user.role }).subscribe({
      next: () => {
        this.successMessage = `Role updated for ${user.username}`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to update role';
        this.loadUsers();
      }
    });
  }

  toggleUserStatus(user: User) {
    user.enabled = !user.enabled;
    this.http.put(`http://localhost:8080/api/admin/users/${user.id}/status`, { enabled: user.enabled }).subscribe({
      next: () => {
        this.successMessage = `User ${user.enabled ? 'enabled' : 'disabled'}`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to update status';
        user.enabled = !user.enabled;
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin-main']);
  }
}

