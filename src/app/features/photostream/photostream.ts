import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import { PhotoService } from '../../services/photo.service';
import { FavoritesService } from '../../services/favorites.service';
import { Photo } from '../../models/photo';
import { PhotoCard } from '../../ui-kit/photo-card/photo-card';
import { InfiniteScroll } from './infinite-scroll';

const PAGE_SIZE = 20;

@Component({
  imports: [AsyncPipe, PhotoCard, InfiniteScroll, MatProgressSpinner],
  selector: 'app-photostream',
  styleUrl: './photostream.scss',
  templateUrl: './photostream.html',
})
export class Photostream implements OnInit, OnDestroy {
  private readonly photoService = inject(PhotoService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  protected readonly isLoading$ = new BehaviorSubject<boolean>(false);
  protected photos: Photo[] = [];
  private page = 1;
  private readonly unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.loadMore();
  }

  protected loadMore(): void {
    if (this.isLoading$.value) {
      return;
    }
    this.isLoading$.next(true);

    this.photoService
      .getPhotos(this.page, PAGE_SIZE)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (newPhotos) => {
          this.photos = [...this.photos, ...newPhotos];
          this.page++;
          this.isLoading$.next(false);
        },
        error: () => {
          this.isLoading$.next(false);
          this.snackBar.open('Failed to load photos. Try again.', 'Dismiss', { duration: 3000 });
        },
      });
  }

  protected handleClickPhoto(photo: Photo): void {
    this.favoritesService.add(photo);
    this.router.navigate([`/photo/${photo.id}`]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
