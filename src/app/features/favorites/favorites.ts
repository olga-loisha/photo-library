import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { FavoritesService } from '../../services/favorites.service';
import { PhotoCard } from '../../ui-kit/photo-card/photo-card';
import { Photo } from '../../models/photo';

@Component({
  imports: [PhotoCard],
  selector: 'app-favorites',
  styleUrl: './favorites.scss',
  templateUrl: './favorites.html',
})
export class Favorites {
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  protected readonly favoritePhotos = signal(this.favoritesService.loadFromStorage());

  protected handleClickPhoto(photo: Photo): void {
    this.router.navigate([`/photo/${photo.id}`]);
  }
}
