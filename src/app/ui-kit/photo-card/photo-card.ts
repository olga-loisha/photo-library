import { Component, input } from '@angular/core';
import { MatCard, MatCardImage } from '@angular/material/card';
import { Photo } from '../../models/photo';

@Component({
  imports: [MatCard, MatCardImage],
  selector: 'app-photo-card',
  styleUrl: './photo-card.scss',
  templateUrl: './photo-card.html',
})
export class PhotoCard {
  readonly photo = input.required<Photo>();
  readonly size = input<number>(200);
}
