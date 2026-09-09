import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Photostream } from './photostream';
import { PhotoService } from '../../services/photo.service';
import { FavoritesService } from '../../services/favorites.service';
import { Photo } from '../../models/photo';

function makePhotos(count: number, offset = 0): Photo[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${offset + index}`,
    url: `https://picsum.photos/id/${offset + index}/200`,
  }));
}

describe('Photostream', () => {
  let fixture: ComponentFixture<Photostream>;
  let getPhotos: ReturnType<typeof vi.fn>;
  let snackBar: { open: ReturnType<typeof vi.fn> };
  let favoritesService: FavoritesService;
  let router: Router;

  async function createComponent(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [Photostream],
      providers: [
        provideRouter([]),
        { provide: PhotoService, useValue: { getPhotos } },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();

    favoritesService = TestBed.inject(FavoritesService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Photostream);
    await fixture.whenStable();
  }

  function cardCount(): number {
    return fixture.nativeElement.querySelectorAll('app-photo-card').length;
  }

  beforeEach(() => {
    localStorage.clear();
    getPhotos = vi.fn().mockReturnValue(of(makePhotos(20)));
    snackBar = { open: vi.fn() };
  });

  it('should create', async () => {
    await createComponent();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('loads the first page of photos on init', async () => {
    await createComponent();

    expect(getPhotos).toHaveBeenCalledWith(1, 20);
    expect(cardCount()).toBe(20);
  });

  it('appends the next page when loadMore runs again', async () => {
    getPhotos
      .mockReturnValueOnce(of(makePhotos(20, 0)))
      .mockReturnValueOnce(of(makePhotos(20, 20)));
    await createComponent();

    (fixture.componentInstance as unknown as { loadMore(): void }).loadMore();
    await fixture.whenStable();

    expect(getPhotos).toHaveBeenLastCalledWith(2, 20);
    expect(cardCount()).toBe(40);
  });

  it('does not start a second load while one is in flight', async () => {
    await createComponent();
    getPhotos.mockClear();

    const component = fixture.componentInstance as unknown as {
      loadMore(): void;
      isLoading$: { next(value: boolean): void };
    };
    component.isLoading$.next(true);
    component.loadMore();

    expect(getPhotos).not.toHaveBeenCalled();
  });

  it('shows a snackbar when loading fails', async () => {
    getPhotos.mockReturnValue(throwError(() => new Error('network')));

    await createComponent();

    expect(snackBar.open).toHaveBeenCalledWith('Failed to load photos. Try again.', 'Dismiss', {
      duration: 3000,
    });
  });

  it('adds the clicked photo to favorites and opens its detail page', async () => {
    await createComponent();
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    (fixture.nativeElement.querySelector('app-photo-card') as HTMLElement).click();

    expect(favoritesService.isFavorite('0')).toBe(true);
    expect(navigateSpy).toHaveBeenCalledWith(['/photo/0']);
  });
});
