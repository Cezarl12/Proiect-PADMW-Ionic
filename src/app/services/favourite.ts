import { Injectable } from '@angular/core';
import { Meal } from '../models/meal';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  private key = 'favourite_meals';

  getAll(): Meal[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  add(meal: Meal): void {
    const favourites = this.getAll();
    if (!this.isFavourite(meal.idMeal)) {
      favourites.push(meal);
      localStorage.setItem(this.key, JSON.stringify(favourites));
    }
  }

  isFavourite(id: string): boolean {
    return this.getAll().some(m => m.idMeal === id);
  }

  toggle(meal: Meal): void {
    this.isFavourite(meal.idMeal) ? this.remove(meal.idMeal) : this.add(meal);
  }

  remove(id: string): void {
    const favourites = this.getAll().filter(m => m.idMeal !== id);
    localStorage.setItem(this.key, JSON.stringify(favourites));
  }
}
