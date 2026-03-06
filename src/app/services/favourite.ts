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
    return result.values?.map((row: any) => JSON.parse(row.meal_data)) || [];
  }

  async add(meal: Meal): Promise<void> {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return;

    await this.db.getDb().run(
      'INSERT INTO favourites (user_id, meal_id, meal_data) VALUES (?, ?, ?)',
      [user.id, meal.idMeal, JSON.stringify(meal)]
    );
  }

  async remove(mealId: string): Promise<void> {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return;

    await this.db.getDb().run(
      'DELETE FROM favourites WHERE user_id = ? AND meal_id = ?',
      [user.id, mealId]
    );
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
