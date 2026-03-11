import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderPage } from '../header/header.page';
import { Meal } from 'src/app/models/meal';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from 'src/app/services/meal';
import { FavouriteService } from 'src/app/services/favourite';
import { ToastController } from '@ionic/angular';
import { AuthSerivce } from 'src/app/services/auth-serivce';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.page.html',
  styleUrls: ['./meal.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderPage]
})
export class MealPage implements OnInit {

  meal: Meal | null = null;
  isLoading = true;
  isFav = false;

  constructor(
    private route: ActivatedRoute,
    private mealService: MealService,
    private favouriteService: FavouriteService,
    private toastCtrl: ToastController,
    private authService: AuthSerivce,
    private router: Router,
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const cache = JSON.parse(localStorage.getItem(`fav_${String(this.authService.getCurrentUser()?.id)}`) || '{}');
      if (cache[id]) {
        this.meal = cache[id];
        this.isFav = await this.favouriteService.isFavourite(id);
        this.isLoading = false;
        return;
      }

      this.mealService.getMealById(id).subscribe({
        next: async (meal) => {
          this.meal = meal;
          this.isFav = await this.favouriteService.isFavourite(meal!.idMeal);
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    }
  }

  getIngredients(): { name: string, measure: string }[] {
    if (!this.meal) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const name = this.meal[`strIngredient${i}`];
      const measure = this.meal[`strMeasure${i}`];
      if (name && name.trim()) {
        ingredients.push({ name: name.trim(), measure: measure?.trim() || '' });
      }
    }
    return ingredients;
  }

  getSteps(): string[] {
    if (!this.meal?.strInstructions) return [];
    return this.meal.strInstructions
      .split(/\r\n\r\n|\n\n|(?<=\.)\s+(?=[A-Z])/)
      .map(s => s.replace(/\r\n|\n/g, ' ').trim())
      .filter(s => s.length > 20);
  }

  async toggleFavourite() {
    if (!this.authService.isLoggedIn()) {
      const toast = await this.toastCtrl.create({
        message: '👤 Trebuie să fii logat pentru a salva rețete',
        duration: 2500,
        position: 'top',
        color: 'warning',
        buttons: [
          {
            text: 'Login',
            handler: () => this.router.navigate(['/login'])
          }
        ]
      });
      await toast.present();
      return;
    }

    if (!this.meal) return;
    await this.favouriteService.toggle(this.meal);
    this.isFav = !this.isFav;
  }

  openYoutube() {
    if (this.meal?.strYoutube) {
      window.open(this.meal.strYoutube, '_blank');
    }
  }

}
