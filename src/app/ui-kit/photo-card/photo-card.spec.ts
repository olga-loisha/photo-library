import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoCard } from './photo-card';
import { Photo } from '../../models/photo';

describe('PhotoCard', () => {
  let component: PhotoCard;
  let fixture: ComponentFixture<PhotoCard>;

  const photo: Photo = { id: '1', url: 'https://picsum.photos/id/1/200' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('photo', photo);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders an image pointing at the photo url', () => {
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe(photo.url);
  });

  it('renders the image at the default size of 200', () => {
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(img.getAttribute('width')).toBe('200');
    expect(img.getAttribute('height')).toBe('200');
  });

  it('renders the image at the size given by the size input', async () => {
    fixture.componentRef.setInput('size', 400);
    await fixture.whenStable();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(img.getAttribute('width')).toBe('400');
    expect(img.getAttribute('height')).toBe('400');
  });
});
