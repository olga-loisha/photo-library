import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Favorites } from './favorites';
import { Photo } from '../../models/photo';

const STORAGE_KEY = 'favorites';

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;
  let router: Router;

  const photos: Photo[] = [
    { id: '1', url: 'https://picsum.photos/id/1/200' },
    { id: '2', url: 'https://picsum.photos/id/2/200' },
  ];

  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));

    await TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [provideRouter([])],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a card for each stored favorite', () => {
    expect(fixture.nativeElement.querySelectorAll('app-photo-card')).toHaveLength(2);
  });

  it('renders nothing when there are no favorites', async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [provideRouter([])],
    }).compileComponents();
    const emptyFixture = TestBed.createComponent(Favorites);
    await emptyFixture.whenStable();

    expect(emptyFixture.nativeElement.querySelectorAll('app-photo-card')).toHaveLength(0);
  });

  it('navigates to the photo detail page when a card is clicked', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const firstCard = fixture.nativeElement.querySelector('app-photo-card') as HTMLElement;
    firstCard.click();

    expect(navigate).toHaveBeenCalledWith(['/photo/1']);
  });
});
