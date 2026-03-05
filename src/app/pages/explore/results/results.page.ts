import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { Meal } from 'src/app/models/meal';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from 'src/app/services/meal';
import { HeaderPage } from '../../header/header.page';
import { FavouriteService } from 'src/app/services/favourite';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderPage]
})
export class ResultsPage implements OnInit {
  meals: Meal[] = [];
  isLoading = true;
  title = '';
  skeletons = Array(8).fill(0);

  constructor(
    private route: ActivatedRoute,
    private mealService: MealService,
    private router: Router,
    private favourite: FavouriteService
  ) { }

  ngOnInit() {
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

  goToMeal(id: string) {
    this.router.navigate(['/meal', id]);
  }

  toggleFavourite(event: Event, meal: Meal) {
    event.stopPropagation();
    this.favourite.toggle(meal);
  }

  isFavourite(id: string): boolean {
    return this.favourite.isFavourite(id);
  }

}