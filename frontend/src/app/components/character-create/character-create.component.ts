import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CharacterService, Character } from '../../services/character.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-character-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="navbar">
      <div class="navbar-brand">Create New Character</div>
      <div class="navbar-links">
        <button (click)="goBack()">Back</button>
        <button (click)="logout()">Logout</button>
      </div>
    </div>
    
    <div class="container">
      <div class="create-form">
        <div class="card">
          <h2>Add New Disney Character</h2>
          
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Name *</label>
              <input type="text" [(ngModel)]="character.name" name="name" required placeholder="e.g., Mickey Mouse">
            </div>
            
            <div class="form-group">
              <label>URL</label>
              <input type="text" [(ngModel)]="character.url" name="url" placeholder="https://api.disneyapi.dev/characters/...">
            </div>
            
            <div class="form-group">
              <label>Image URL or Base64</label>
              <textarea [(ngModel)]="character.image" name="image" rows="3" placeholder="data:image/png;base64,... or http://..."></textarea>
            </div>
            
            <div class="form-group">
              <label>Films (comma-separated)</label>
              <textarea [(ngModel)]="filmsString" name="films" rows="3" placeholder="e.g., Fantasia, The Mickey Mouse Club"></textarea>
            </div>
            
            <div class="form-group">
              <label>Short Films (comma-separated)</label>
              <textarea [(ngModel)]="shortFilmsString" name="shortFilms" rows="3" placeholder="e.g., Steamboat Willie"></textarea>
            </div>
            
            <div class="form-group">
              <label>TV Shows (comma-separated)</label>
              <textarea [(ngModel)]="tvShowsString" name="tvShows" rows="3" placeholder="e.g., Mickey Mouse Clubhouse"></textarea>
            </div>
            
            <div class="form-group">
              <label>Video Games (comma-separated)</label>
              <textarea [(ngModel)]="videoGamesString" name="videoGames" rows="3" placeholder="e.g., Kingdom Hearts, Epic Mickey"></textarea>
            </div>
            
            <div class="form-group">
              <label>Park Attractions (comma-separated)</label>
              <textarea [(ngModel)]="parkAttractionsString" name="parkAttractions" rows="3" placeholder="e.g., Mickey's PhilharMagic"></textarea>
            </div>
            
            <div class="form-group">
              <label>Allies (comma-separated)</label>
              <textarea [(ngModel)]="alliesString" name="allies" rows="3" placeholder="e.g., Donald Duck, Goofy, Minnie Mouse"></textarea>
            </div>
            
            <div class="form-group">
              <label>Enemies (comma-separated)</label>
              <textarea [(ngModel)]="enemiesString" name="enemies" rows="3" placeholder="e.g., Pete, Mortimer Mouse"></textarea>
            </div>
            
            <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
            <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
            
            <div class="buttons">
              <button type="submit" class="btn btn-primary" [disabled]="!character.name">Create Character</button>
              <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-form {
      max-width: 800px;
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

    .buttons {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }

    .buttons button {
      flex: 1;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class CharacterCreateComponent {
  character: Partial<Character> = {
    name: '',
    url: '',
    image: '',
    films: [],
    shortFilms: [],
    tvShows: [],
    videoGames: [],
    parkAttractions: [],
    allies: [],
    enemies: []
  };
  
  filmsString = '';
  shortFilmsString = '';
  tvShowsString = '';
  videoGamesString = '';
  parkAttractionsString = '';
  alliesString = '';
  enemiesString = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private characterService: CharacterService,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (!this.character.name || this.character.name.trim() === '') {
      this.errorMessage = 'Character name is required';
      return;
    }

    const newCharacter: Character = {
      id: 0, // Will be assigned by backend
      name: this.character.name,
      url: this.character.url || '',
      image: this.character.image || '',
      films: this.filmsString.split(',').map(s => s.trim()).filter(s => s),
      shortFilms: this.shortFilmsString.split(',').map(s => s.trim()).filter(s => s),
      tvShows: this.tvShowsString.split(',').map(s => s.trim()).filter(s => s),
      videoGames: this.videoGamesString.split(',').map(s => s.trim()).filter(s => s),
      parkAttractions: this.parkAttractionsString.split(',').map(s => s.trim()).filter(s => s),
      allies: this.alliesString.split(',').map(s => s.trim()).filter(s => s),
      enemies: this.enemiesString.split(',').map(s => s.trim()).filter(s => s)
    };

    this.characterService.createCharacter(newCharacter).subscribe({
      next: (response) => {
        this.successMessage = 'Character created successfully!';
        this.errorMessage = '';
        setTimeout(() => {
          this.goBack();
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Failed to create character. Please check all fields.';
        this.successMessage = '';
        console.error('Error creating character:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin-main']);
  }

  logout() {
    this.authService.logout();
  }
}

