import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./pages/navigation/navigation.page').then(m => m.NavigationPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'explore',
        loadComponent: () => import('./pages/explore/explore.page').then(m => m.ExplorePage),

      },
      {
        path: 'favourite',
        loadComponent: () => import('./pages/favourite/favourite.page').then(m => m.FavouritePage)
      },
      {
        path: 'results',
        loadComponent: () => import('./pages/explore/results/results.page').then(m => m.ResultsPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
      },

    ]
  },
  {
    path: 'header',
    loadComponent: () => import('./pages/header/header.page').then(m => m.HeaderPage)
  },
  {
    path: 'meal/:id',
    loadComponent: () => import('./pages/meal/meal.page').then(m => m.MealPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then(m => m.LoginPage)
  },


];