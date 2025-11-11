import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar" [class.open]="isOpen">
      <button class="close-btn" (click)="close()">✕</button>
      
      <div class="user-info">
        <div class="avatar">{{ getUserInitials() }}</div>
        <h3>{{ username }}</h3>
        <p class="role-badge">{{ role }}</p>
      </div>
      
      <nav class="sidebar-nav">
        <a (click)="goToMainPage()" class="nav-item" [class.active]="isMainPageActive()">
          <span class="icon">🏠</span>
          <span>Disney Characters</span>
        </a>
        
        <a (click)="navigateTo('account-settings')" class="nav-item" [class.active]="currentUrl.includes('account-settings')">
          <span class="icon">⚙️</span>
          <span>Account Settings</span>
        </a>
        
        <a *ngIf="isOnlyAdmin" (click)="navigateTo('manage-users')" class="nav-item admin-only" [class.active]="currentUrl.includes('manage-users')">
          <span class="icon">👥</span>
          <span>Manage Users</span>
        </a>
        
        <a (click)="logout()" class="nav-item logout">
          <span class="icon">🚪</span>
          <span>Logout</span>
        </a>
      </nav>
    </div>
    
    <div class="overlay" *ngIf="isOpen" (click)="close()"></div>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 0;
      left: -300px;
      width: 300px;
      height: 100vh;
      background: white;
      box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
      transition: left 0.3s ease;
      z-index: 1001;
      overflow-y: auto;
    }

    .sidebar.open {
      left: 0;
    }

    .close-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 5px 10px;
    }

    .close-btn:hover {
      color: #333;
    }

    .user-info {
      padding: 40px 20px 30px;
      text-align: center;
      border-bottom: 1px solid #eee;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: bold;
      margin: 0 auto 15px;
    }

    .user-info h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      color: #333;
    }

    .role-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #667eea;
      color: white;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .sidebar-nav {
      padding: 20px 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 15px 25px;
      color: #333;
      text-decoration: none;
      cursor: pointer;
      transition: background 0.2s ease;
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background: #f8f9fa;
      border-left-color: #667eea;
    }

    .nav-item .icon {
      font-size: 20px;
      margin-right: 15px;
      width: 24px;
      text-align: center;
    }

    .nav-item.active {
      background: #f0f4ff;
      border-left-color: #667eea;
      color: #667eea;
      font-weight: 700;
    }

    .nav-item.logout {
      margin-top: 20px;
      border-top: 1px solid #eee;
      color: #dc3545;
    }

    .nav-item.logout:hover {
      background: #fff5f5;
      border-left-color: #dc3545;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
  `]
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  
  username = '';
  role = '';
  isAdmin = false;
  isOnlyAdmin = false;
  currentUrl = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.updateUserInfo();
    this.currentUrl = this.router.url;
    
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(() => {
      this.updateUserInfo();
    });
    
    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
    });
  }

  updateUserInfo() {
    const user = this.authService.getCurrentUser();
    this.username = user?.username || 'User';
    this.role = user?.role || 'USER';
    this.isAdmin = this.authService.isAdmin();
    this.isOnlyAdmin = this.authService.isOnlyAdmin();
  }

  getUserInitials(): string {
    return this.username.substring(0, 2).toUpperCase();
  }

  isMainPageActive(): boolean {
    return this.currentUrl.includes('admin-main') || 
           this.currentUrl.includes('user-main') || 
           this.currentUrl.includes('/character/');
  }

  goToMainPage() {
    if (this.isAdmin) {
      this.router.navigate(['/admin-main']);
    } else {
      this.router.navigate(['/user-main']);
    }
    this.close();
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
    this.close();
  }

  logout() {
    this.authService.logout();
  }

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}

