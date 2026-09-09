import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { PhotoService } from './photo.service';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('emits the requested number of photos', async () => {
    const photos = await firstValueFrom(service.getPhotos(1, 5));

    expect(photos).toHaveLength(5);
  });

  it('emits photos with a string id and a matching picsum url', async () => {
    const [photo] = await firstValueFrom(service.getPhotos(1, 1));

    expect(typeof photo.id).toBe('string');
    expect(photo.url).toBe(`https://picsum.photos/id/${photo.id}/200`);
  });

  it('emits asynchronously', async () => {
    let emitted = false;
    service.getPhotos(1, 1).subscribe(() => (emitted = true));

    expect(emitted).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 350));

    expect(emitted).toBe(true);
  });
});
