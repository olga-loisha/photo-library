import { Component, computed, inject, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

import { FavoritesService } from '../../services/favorites.service';
import { Photo } from '../../models/photo';
import { PhotoCard } from '../../ui-kit/photo-card/photo-card';

@Component({
  imports: [PhotoCard, MatButton],
  selector: 'app-photo-detail',
  styleUrl: './photo-detail.scss',
  templateUrl: './photo-detail.html',
})
export class PhotoDetail {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  private readonly photoId = signal(this.activatedRoute.snapshot.paramMap.get('id') ?? '');

  protected readonly photo: Signal<Photo | undefined> = computed(() =>
    this.favoritesService.getById(this.photoId()),
  );

  constructor() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.photoId.set(params.get('id') ?? '');
    });
  }

  protected remove(id: string): void {
    this.favoritesService.remove(id);
    this.router.navigate(['/']);
  }
}
