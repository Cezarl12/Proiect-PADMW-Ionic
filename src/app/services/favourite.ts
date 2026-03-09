import { Injectable } from '@angular/core';
import { Meal } from '../models/meal';
import { DbService } from './db-service';
import { AuthSerivce } from './auth-serivce';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  constructor(
    private db: DbService,
    private auth: AuthSerivce
  ) { }

  async getAll(): Promise<Meal[]> {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return [];

    const result = await this.db.getDb().query(
      'SELECT meal_data FROM favourites WHERE user_id = ?',
      [user.id]
    );
    const meals = result.values?.map((row: any) => JSON.parse(row.meal_data)) || [];

    const cache: any = {};
    meals.forEach((m: Meal) => cache[m.idMeal] = m);
    localStorage.setItem(`fav_${String(user.id)}`, JSON.stringify(cache));

    return meals;
  }

  async add(meal: Meal): Promise<void> {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return;

    await this.db.getDb().run(
      'INSERT INTO favourites (user_id, meal_id, meal_data) VALUES (?, ?, ?)',
      [user.id, meal.idMeal, JSON.stringify(meal)]
    );

    const cache = JSON.parse(localStorage.getItem(`fav_${String(user.id)}`) || '{}');
    cache[meal.idMeal] = meal;
    localStorage.setItem(`fav_${String(user.id)}`, JSON.stringify(cache));
  }

  async remove(mealId: string): Promise<void> {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return;

    await this.db.getDb().run(
      'DELETE FROM favourites WHERE user_id = ? AND meal_id = ?',
      [user.id, mealId]
    );

    const cache = JSON.parse(localStorage.getItem(`fav_${String(user.id)}`) || '{}');
    delete cache[mealId];
    localStorage.setItem(`fav_${String(user.id)}`, JSON.stringify(cache));
  }

  async isFavourite(mealId: string): Promise<boolean> {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return false;

    const result = await this.db.getDb().query(
      'SELECT id FROM favourites WHERE user_id = ? AND meal_id = ?',
      [user.id, mealId]
    );
    return (result.values?.length ?? 0) > 0;
  }

  async toggle(meal: Meal): Promise<void> {
    const fav = await this.isFavourite(meal.idMeal);
    fav ? await this.remove(meal.idMeal) : await this.add(meal);
  }

}
