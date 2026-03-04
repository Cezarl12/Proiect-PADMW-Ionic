import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { MealService } from 'src/app/services/meal';
import { Meal } from 'src/app/models/meal';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [CommonModule, IonContent],
})
export class HomePage implements OnInit {
  randomMeal: Meal | null = null;
  isLoading = true;

  constructor(
    private mealService: MealService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadRandomMeal();
  }

  loadRandomMeal() {
    this.isLoading = true;
    this.mealService.getRandomMeal().subscribe({
      next: (meal) => {
        this.randomMeal = meal;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getTags(): string[] {
    if (!this.randomMeal?.strTags) return [];
    return this.randomMeal.strTags.split(',').map(t => t.trim()).filter(Boolean);
  }

  goToMeal(id: string) {
    this.router.navigate(['/tabs/meal', id]);
  }

  goToExplore() {
    this.router.navigate(['/tabs/explora']);
  }
}