import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'acasa',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./pages/navigation/navigation.page').then(m => m.NavigationPage),
    children: [
      {
        path: 'acasa',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
      },
    ]
  }
];