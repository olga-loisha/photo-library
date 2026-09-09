import { Routes } from '@angular/router';

import { Favorites } from './features/favorites/favorites';
import { Photostream } from './features/photostream/photostream';
import { PhotoDetail } from './features/photo-detail/photo-detail';

export const routes: Routes = [
  {
    path: '',
    component: Photostream,
  },
  {
    path: 'favorites',
    component: Favorites,
  },
  {
    path: 'photo/:id',
    component: PhotoDetail,
  },
  { path: '**', redirectTo: '' },
];
