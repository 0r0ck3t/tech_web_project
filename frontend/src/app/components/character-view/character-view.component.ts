import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService, Character } from '../../services/character.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-character-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="navbar">
      <div class="navbar-brand">Disney Characters</div>
      <div class="navbar-links">
        <button (click)="goBack()">Back</button>
        <button (click)="logout()">Logout</button>
      </div>
    </div>
    
    <div class="container" *ngIf="character">
      <div class="character-detail">
        <div class="card">
          <div class="detail-header">
            <img [src]="character.image" [alt]="character.name" class="detail-image">
            <div class="detail-info">
              <h1>{{ character.name }}</h1>
              <p *ngIf="character.url" class="url">{{ character.url }}</p>
            </div>
          </div>
          
          <div class="detail-section" *ngIf="character.films.length > 0">
            <h3>Films</h3>
            <ul>
              <li *ngFor="let film of character.films">{{ film }}</li>
            </ul>
          </div>
          
          <div class="detail-section" *ngIf="character.shortFilms.length > 0">
            <h3>Short Films</h3>
            <ul>
              <li *ngFor="let film of character.shortFilms">{{ film }}</li>
            </ul>
          </div>
          
          <div class="detail-section" *ngIf="character.tvShows.length > 0">
            <h3>TV Shows</h3>
            <ul>
              <li *ngFor="let show of character.tvShows">{{ show }}</li>
            </ul>
          </div>
          
          <div class="detail-section" *ngIf="character.videoGames.length > 0">
            <h3>Video Games</h3>
            <ul>
              <li *ngFor="let game of character.videoGames">{{ game }}</li>
            </ul>
          </div>
          
          <div class="detail-section" *ngIf="character.parkAttractions.length > 0">
            <h3>Park Attractions</h3>
            <ul>
              <li *ngFor="let attraction of character.parkAttractions">{{ attraction }}</li>
            </ul>
          </div>
          
          <div class="detail-section" *ngIf="character.allies.length > 0">
            <h3>Allies</h3>
            <ul>
              <li *ngFor="let ally of character.allies">{{ ally }}</li>
            </ul>
          </div>
          
          <div class="detail-section" *ngIf="character.enemies.length > 0">
            <h3>Enemies</h3>
            <ul>
              <li *ngFor="let enemy of character.enemies">{{ enemy }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .character-detail {
      max-width: 800px;
      margin: 40px auto;
    }

    .detail-header {
      display: flex;
      gap: 30px;
      margin-bottom: 30px;
    }

    .detail-image {
      width: 300px;
      height: 400px;
      object-fit: cover;
      border-radius: 12px;
    }

    .detail-info h1 {
      font-size: 36px;
      margin-bottom: 10px;
      color: #333;
    }

    .url {
      color: #667eea;
      font-size: 14px;
    }

    .detail-section {
      margin: 30px 0;
    }

    .detail-section h3 {
      font-size: 24px;
      margin-bottom: 15px;
      color: #667eea;
    }

    .detail-section ul {
      list-style: none;
      padding: 0;
    }

    .detail-section li {
      padding: 10px;
      background: #f8f9fa;
      margin-bottom: 8px;
      border-radius: 6px;
    }

    @media (max-width: 768px) {
      .detail-header {
        flex-direction: column;
      }

      .detail-image {
        width: 100%;
        height: auto;
      }
    }
  `]
})
export class CharacterViewComponent implements OnInit {
  character: Character | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.characterService.getCharacterById(id).subscribe({
      next: (data) => {
        this.character = data;
      },
      error: (error) => {
        console.error('Error loading character:', error);
        this.goBack();
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

  logout() {
    this.authService.logout();
  }
}

