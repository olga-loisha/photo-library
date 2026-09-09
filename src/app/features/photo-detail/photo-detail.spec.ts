import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { PhotoDetail } from './photo-detail';
import { FavoritesService } from '../../services/favorites.service';
import { Photo } from '../../models/photo';

describe('PhotoDetail', () => {
  let fixture: ComponentFixture<PhotoDetail>;
  let favoritesService: FavoritesService;
  let router: Router;

  const photo: Photo = { id: '42', url: 'https://picsum.photos/id/42/200' };

  async function createComponent(routeId: string): Promise<void> {
    const paramMap = convertToParamMap({ id: routeId });

    await TestBed.configureTestingModule({
      imports: [PhotoDetail],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap }, paramMap: of(paramMap) },
        },
      ],
    }).compileComponents();

    favoritesService = TestBed.inject(FavoritesService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(PhotoDetail);
    await fixture.whenStable();
  }

  beforeEach(() => {
    localStorage.clear();
  });

  it('should create', async () => {
    await createComponent('42');

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the favorite that matches the route id', async () => {
    await createComponent('42');
    favoritesService.add(photo);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-photo-card')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('Photo not found');
  });

  it('shows a not-found message when the photo is not a favorite', async () => {
    await createComponent('999');

    expect(fixture.nativeElement.querySelector('app-photo-card')).toBeFalsy();
    expect(fixture.nativeElement.textContent).toContain('Photo not found.');
  });

  it('removes the photo and navigates home when the remove button is clicked', async () => {
    await createComponent('42');
    favoritesService.add(photo);
    await fixture.whenStable();

    const removeSpy = vi.spyOn(favoritesService, 'remove');
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(removeSpy).toHaveBeenCalledWith('42');
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
