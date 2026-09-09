import { Service, signal } from '@angular/core';
import { Photo } from '../models/photo';

const STORAGE_KEY = 'favorites';

@Service()
export class FavoritesService {
  private readonly favoritesSignal = signal<Photo[]>(this.loadFromStorage());
  readonly favorites = this.favoritesSignal.asReadonly();

  isFavorite(id: string): boolean {
    return this.favoritesSignal().some((photo) => photo.id === id);
  }

  getById(id: string): Photo | undefined {
    return this.favoritesSignal().find((photo) => photo.id === id);
  }

  add(photo: Photo): void {
    if (this.isFavorite(photo.id)) {
      return;
    }

    this.favoritesSignal.update((favorites) => [...favorites, photo]);
    this.saveToStorage(this.favoritesSignal());
  }

  remove(id: string): void {
    this.favoritesSignal.update((favorites) => favorites.filter((photo) => photo.id !== id));
    this.saveToStorage(this.favoritesSignal());
  }

  loadFromStorage(): Photo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveToStorage(favorites: Photo[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }
}
