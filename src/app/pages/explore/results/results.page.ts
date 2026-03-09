import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonToast } from '@ionic/angular/standalone';
import { Meal } from 'src/app/models/meal';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from 'src/app/services/meal';
import { HeaderPage } from '../../header/header.page';
import { FavouriteService } from 'src/app/services/favourite';
import { AuthSerivce } from 'src/app/services/auth-serivce';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, HeaderPage, IonToast]
})
export class ResultsPage implements OnInit {
  meals: Meal[] = [];
  isLoading = true;
  title = '';
  skeletons = Array(8).fill(0);
  favouriteIds: string[] = [];
  showToast = false;

  constructor(
    private route: ActivatedRoute,
    private mealService: MealService,
    private router: Router,
    private favourite: FavouriteService,
    private authService: AuthSerivce,
  ) { }

  async ngOnInit() {
    this.favouriteIds = [];
    await this.loadFavouriteIds();
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.title = `"${params['q']}"`;
        this.mealService.searchMeals(params['q']).subscribe({
          next: (meals) => { this.meals = meals; this.isLoading = false; },
          error: () => this.isLoading = false
        });
      } else if (params['category']) {
        this.title = params['category'];
        this.mealService.getMealsByCategory(params['category']).subscribe({
          next: (meals) => { this.meals = meals; this.isLoading = false; },
          error: () => this.isLoading = false
        });
      }
    });
  }

  async loadFavouriteIds() {
    const favs = await this.favourite.getAll();
    this.favouriteIds = favs.map(m => m.idMeal);
  }

  async toggleFavourite(event: Event, meal: Meal) {
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.showToast = true;
      return;
    }

    this.mealService.getMealById(meal.idMeal).subscribe({
      next: async (fullMeal) => {
        if (fullMeal) {
          await this.favourite.toggle(fullMeal);
          await this.loadFavouriteIds();
        }
      }
    });
  }

  goToMeal(id: string) {
    this.router.navigate(['/meal', id]);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}