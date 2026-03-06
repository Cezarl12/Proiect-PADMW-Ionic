import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { MealService } from 'src/app/services/meal';
import { Meal } from 'src/app/models/meal';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, RouterLink],
})
export class HomePage implements OnInit {
  randomMeal: Meal | null = null;
  isLoading = true;
  isLoggedIn = false

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
      error: (err) => {
        this.isLoading = false;
        console.log(err)
      }
    });
  }


  goToMeal(id: string) {
    this.router.navigate(['/meal', id]);
  }

  goToExplore() {
    this.router.navigate(['/explore']);
  }
}