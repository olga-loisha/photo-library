import { Service } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Photo } from '../models/photo';

@Service()
export class PhotoService {
  private readonly imageSide = 200;

  getPhotos(page: number, limit: number): Observable<Photo[]> {
    const photos = this.generatePhotos(page, limit);
    const randomDelay = this.getRandomNumber(200, 300);

    return of(photos).pipe(delay(randomDelay));
  }

  private generatePhotos(page: number, limit: number): Photo[] {
    return Array.from({ length: limit }, (_, i) => {
      const id = this.getRandomNumber(1, 1000);

      return {
        id: id.toString(),
        url: `https://picsum.photos/id/${id}/${this.imageSide}`,
      };
    });
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
