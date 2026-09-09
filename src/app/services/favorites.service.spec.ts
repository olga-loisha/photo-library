import { TestBed } from '@angular/core/testing';

import { FavoritesService } from './favorites.service';
import { Photo } from '../models/photo';

const STORAGE_KEY = 'favorites';

function makePhoto(id: string): Photo {
  return { id, url: `https://picsum.photos/id/${id}/200` };
}

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts empty when nothing is stored', () => {
    expect(service.favorites()).toEqual([]);
    expect(service.isFavorite('1')).toBe(false);
  });

  describe('add', () => {
    it('adds a photo and exposes it through the favorites signal', () => {
      const photo = makePhoto('1');

      service.add(photo);

      expect(service.favorites()).toEqual([photo]);
      expect(service.isFavorite('1')).toBe(true);
    });

    it('does not add the same photo twice', () => {
      const photo = makePhoto('1');

      service.add(photo);
      service.add(photo);

      expect(service.favorites()).toEqual([photo]);
    });

    it('persists the favorites to localStorage', () => {
      const photo = makePhoto('7');

      service.add(photo);

      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([photo]);
    });
  });

  describe('remove', () => {
    it('removes only the photo with the given id', () => {
      service.add(makePhoto('1'));
      service.add(makePhoto('2'));

      service.remove('1');

      expect(service.favorites().map((photo) => photo.id)).toEqual(['2']);
    });

    it('persists the removal to localStorage', () => {
      service.add(makePhoto('1'));

      service.remove('1');

      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')).toEqual([]);
    });
  });

  describe('getById', () => {
    it('returns the matching favorite', () => {
      const photo = makePhoto('42');
      service.add(photo);

      expect(service.getById('42')).toEqual(photo);
    });

    it('returns undefined when there is no match', () => {
      expect(service.getById('missing')).toBeUndefined();
    });
  });

  describe('loadFromStorage', () => {
    it('returns an empty array when nothing is stored', () => {
      expect(service.loadFromStorage()).toEqual([]);
    });

    it('returns the stored array', () => {
      const photos = [makePhoto('1'), makePhoto('2')];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));

      expect(service.loadFromStorage()).toEqual(photos);
    });

    it('returns an empty array when the stored value is not an array', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }));

      expect(service.loadFromStorage()).toEqual([]);
    });

    it('returns an empty array when the stored value is not valid JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{ broken');

      expect(service.loadFromStorage()).toEqual([]);
    });

    it('seeds the favorites signal from storage on creation', () => {
      const photos = [makePhoto('9')];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});

      expect(TestBed.inject(FavoritesService).favorites()).toEqual(photos);
    });
  });
});
