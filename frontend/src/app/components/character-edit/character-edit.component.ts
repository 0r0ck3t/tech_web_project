import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService, Character } from '../../services/character.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-character-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="navbar">
      <div class="navbar-brand">Edit Character</div>
      <div class="navbar-links">
        <button (click)="goBack()">Back</button>
        <button (click)="logout()">Logout</button>
      </div>
    </div>
    
    <div class="container" *ngIf="character">
      <div class="edit-form">
        <div class="card">
          <h2>Edit Character: {{ character.name }}</h2>
          
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Name</label>
              <input type="text" [(ngModel)]="character.name" name="name" required>
            </div>
            
            <div class="form-group">
              <label>URL</label>
              <input type="text" [(ngModel)]="character.url" name="url">
            </div>
            
            <div class="form-group">
              <label>Films (comma-separated)</label>
              <textarea [(ngModel)]="filmsString" name="films" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label>Short Films (comma-separated)</label>
              <textarea [(ngModel)]="shortFilmsString" name="shortFilms" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label>TV Shows (comma-separated)</label>
              <textarea [(ngModel)]="tvShowsString" name="tvShows" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label>Video Games (comma-separated)</label>
              <textarea [(ngModel)]="videoGamesString" name="videoGames" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label>Park Attractions (comma-separated)</label>
              <textarea [(ngModel)]="parkAttractionsString" name="parkAttractions" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label>Allies (comma-separated)</label>
              <textarea [(ngModel)]="alliesString" name="allies" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label>Enemies (comma-separated)</label>
              <textarea [(ngModel)]="enemiesString" name="enemies" rows="3"></textarea>
            </div>
            
            <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
            <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
            
            <div class="buttons">
              <button type="submit" class="btn btn-primary">Save Changes</button>
              <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .edit-form {
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
  `]
})
export class CharacterEditComponent implements OnInit {
  character: Character | null = null;
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
        this.filmsString = data.films.join(', ');
        this.shortFilmsString = data.shortFilms.join(', ');
        this.tvShowsString = data.tvShows.join(', ');
        this.videoGamesString = data.videoGames.join(', ');
        this.parkAttractionsString = data.parkAttractions.join(', ');
        this.alliesString = data.allies.join(', ');
        this.enemiesString = data.enemies.join(', ');
      },
      error: (error) => {
        console.error('Error loading character:', error);
        this.goBack();
      }
    });
  }

  onSubmit() {
    if (!this.character) return;

    const updatedCharacter: Character = {
      ...this.character,
      films: this.filmsString.split(',').map(s => s.trim()).filter(s => s),
      shortFilms: this.shortFilmsString.split(',').map(s => s.trim()).filter(s => s),
      tvShows: this.tvShowsString.split(',').map(s => s.trim()).filter(s => s),
      videoGames: this.videoGamesString.split(',').map(s => s.trim()).filter(s => s),
      parkAttractions: this.parkAttractionsString.split(',').map(s => s.trim()).filter(s => s),
      allies: this.alliesString.split(',').map(s => s.trim()).filter(s => s),
      enemies: this.enemiesString.split(',').map(s => s.trim()).filter(s => s)
    };

    this.characterService.updateCharacter(this.character.id, updatedCharacter).subscribe({
      next: () => {
        this.successMessage = 'Character updated successfully!';
        this.errorMessage = '';
        setTimeout(() => {
          this.goBack();
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update character';
        this.successMessage = '';
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

