import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CharacterService, Character } from '../../services/character.service';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="navbar">
      <button class="menu-btn" (click)="toggleSidebar()">☰</button>
      <div class="navbar-brand">Disney Characters</div>
      <div class="navbar-links">
        <span>Welcome, {{ username }}</span>
      </div>
    </div>

    <app-sidebar [(isOpen)]="sidebarOpen"></app-sidebar>
    
    <div class="container">
      <div class="header-section">
        <h1>Disney Characters Management</h1>
        <button class="btn btn-primary create-btn" (click)="createNewCharacter()">
          ➕ Create New Character
        </button>
      </div>
      
      <div class="search-section" *ngIf="!loading">
        <div class="search-bar">
          <input type="text" [(ngModel)]="searchQuery" (input)="applyFilters()" 
                 placeholder="🔍 Search by name, films, TV shows...">
        </div>
        
        <div class="filters">
          <button class="filter-btn" [class.active]="activeFilter === 'all'" (click)="setFilter('all')">
            All ({{ totalItems }})
          </button>
          <button class="filter-btn" [class.active]="activeFilter === 'films'" (click)="setFilter('films')">
            🎬 Has Films ({{ getFilterCount('films') }})
          </button>
          <button class="filter-btn" [class.active]="activeFilter === 'tvShows'" (click)="setFilter('tvShows')">
            📺 Has TV Shows ({{ getFilterCount('tvShows') }})
          </button>
          <button class="filter-btn" [class.active]="activeFilter === 'videoGames'" (click)="setFilter('videoGames')">
            🎮 Has Video Games ({{ getFilterCount('videoGames') }})
          </button>
          <button class="filter-btn" [class.active]="activeFilter === 'parkAttractions'" (click)="setFilter('parkAttractions')">
            🎡 Has Park Attractions ({{ getFilterCount('parkAttractions') }})
          </button>
        </div>
      </div>
      
      <div *ngIf="loading" class="loading">Loading characters...</div>
      
      <div class="pagination-controls" *ngIf="!loading">
        <div class="per-page">
          <label>Items per page:</label>
          <select [(ngModel)]="itemsPerPage" (change)="onItemsPerPageChange()">
            <option [value]="10">10</option>
            <option [value]="20">20</option>
            <option [value]="50">50</option>
            <option [value]="100">100</option>
          </select>
        </div>
        <div class="pagination-info">
          Showing {{ getStartIndex() + 1 }} to {{ getEndIndex() }} of {{ totalItems }} characters
        </div>
      </div>
      
      <div class="grid">
        <div *ngFor="let character of paginatedCharacters" class="character-card">
          <img [src]="character.image" [alt]="character.name" class="character-image">
          <div class="character-info">
            <h3 class="character-name">{{ character.name }}</h3>
            <p *ngIf="character.films.length > 0">Films: {{ character.films.length }}</p>
            <p *ngIf="character.tvShows.length > 0">TV Shows: {{ character.tvShows.length }}</p>
            <div class="card-buttons">
              <button class="btn btn-primary" (click)="viewCharacter(character.id)">View</button>
              <button class="btn btn-secondary" (click)="editCharacter(character.id)">Edit</button>
              <button class="btn btn-danger" (click)="deleteCharacter(character.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="pagination" *ngIf="!loading && totalPages > 1">
        <button class="page-btn" (click)="goToPage(1)" [disabled]="currentPage === 1">
          ⏮️ First
        </button>
        <button class="page-btn" (click)="previousPage()" [disabled]="currentPage === 1">
          ◀️ Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="page-btn" (click)="nextPage()" [disabled]="currentPage === totalPages">
          Next ▶️
        </button>
        <button class="page-btn" (click)="goToPage(totalPages)" [disabled]="currentPage === totalPages">
          Last ⏭️
        </button>
      </div>
    </div>
  `,
  styles: [`
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 40px 0;
      flex-wrap: wrap;
      gap: 20px;
    }

    h1 {
      color: white;
      font-size: 42px;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .create-btn {
      font-size: 18px;
      padding: 15px 30px;
      white-space: nowrap;
    }

    .card-buttons {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .card-buttons .btn {
      flex: 1;
      padding: 8px 16px;
      font-size: 14px;
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

    .pagination-controls {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .per-page {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .per-page select {
      padding: 8px 12px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
    }

    .pagination-info {
      color: #666;
      font-weight: 600;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      margin: 40px 0;
    }

    .page-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      background: white;
      color: #667eea;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .page-btn:hover:not(:disabled) {
      background: #667eea;
      color: white;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      padding: 10px 20px;
      background: white;
      border-radius: 6px;
      font-weight: 600;
      color: #333;
    }

    .search-section {
      margin: 20px 0;
    }

    .search-bar input {
      width: 100%;
      padding: 15px 20px;
      font-size: 18px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .search-bar input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .filters {
      display: flex;
      gap: 10px;
      margin-top: 15px;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 10px 20px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      color: #666;
    }

    .filter-btn:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .filter-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: transparent;
    }

    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        text-align: center;
      }
      
      h1 {
        font-size: 32px;
      }

      .pagination-controls {
        flex-direction: column;
        gap: 15px;
      }

      .pagination {
        flex-wrap: wrap;
      }
    }
  `]
})
export class AdminMainComponent implements OnInit {
  sidebarOpen = false;
  characters: Character[] = [];
  filteredCharacters: Character[] = [];
  paginatedCharacters: Character[] = [];
  loading = true;
  username = '';
  role = '';
  
  // Search and Filter
  searchQuery = '';
  activeFilter = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 20;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private characterService: CharacterService,
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    this.username = user?.username || 'Admin';
    this.role = user?.role || 'ADMIN';
  }

  ngOnInit() {
    this.loadCharacters();
  }

  loadCharacters() {
    this.characterService.getAllCharacters().subscribe({
      next: (data) => {
        this.characters = data;
        this.filteredCharacters = data;
        this.totalItems = data.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePaginatedCharacters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading characters:', error);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.characters];

    // Apply search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(char => 
        char.name.toLowerCase().includes(query) ||
        char.films.some(f => f.toLowerCase().includes(query)) ||
        char.shortFilms.some(f => f.toLowerCase().includes(query)) ||
        char.tvShows.some(s => s.toLowerCase().includes(query)) ||
        char.videoGames.some(g => g.toLowerCase().includes(query)) ||
        char.parkAttractions.some(p => p.toLowerCase().includes(query)) ||
        char.allies.some(a => a.toLowerCase().includes(query)) ||
        char.enemies.some(e => e.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(char => {
        const field = char[this.activeFilter as keyof Character];
        return Array.isArray(field) && field.length > 0;
      });
    }

    this.filteredCharacters = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updatePaginatedCharacters();
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilters();
  }

  getFilterCount(field: string): number {
    return this.characters.filter(char => {
      const f = char[field as keyof Character];
      return Array.isArray(f) && f.length > 0;
    }).length;
  }

  updatePaginatedCharacters() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCharacters = this.filteredCharacters.slice(startIndex, endIndex);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updatePaginatedCharacters();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedCharacters();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCharacters();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedCharacters();
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.totalItems ? this.totalItems : end;
  }

  viewCharacter(id: number) {
    this.router.navigate(['/character', id]);
  }

  createNewCharacter() {
    this.router.navigate(['/character/new']);
  }

  editCharacter(id: number) {
    this.router.navigate(['/character', id, 'edit']);
  }

  deleteCharacter(id: number) {
    if (confirm('Are you sure you want to delete this character?')) {
      this.characterService.deleteCharacter(id).subscribe({
        next: () => {
          this.loadCharacters();
        },
        error: (error) => {
          console.error('Error deleting character:', error);
          alert('Failed to delete character');
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}

