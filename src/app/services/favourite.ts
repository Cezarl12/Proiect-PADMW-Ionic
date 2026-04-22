import { Injectable, inject } from '@angular/core';
import { Meal } from '../models/meal';
import { AuthSerivce } from './auth-serivce';
import { Firestore, collection, doc, setDoc, deleteDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {

  private firestore = inject(Firestore);
  private auth = inject(AuthSerivce);
  private getCacheKey(): string | null {
    const id = this.auth.getCurrentUser()?.id;
    return id ? `fav_${id}` : null;
  }

  private getCache(): Record<string, Meal> {
    const key = this.getCacheKey();
    if (!key) return {};
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  private saveCache(cache: Record<string, Meal>): void {
    const key = this.getCacheKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(cache));
  }

  async getAll(): Promise<Meal[]> {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return [];

    if (!navigator.onLine) {
      return Object.values(this.getCache());
    }

    try {
      const snapshot = await getDocs(collection(this.firestore, `favourites/${user.id}/meals`));
      const meals = snapshot.docs.map(d => d.data() as Meal);

      const cache: Record<string, Meal> = {};
      meals.forEach(m => cache[m.idMeal] = m);
      this.saveCache(cache);

      return meals;
    } catch (e) {
      return Object.values(this.getCache());
    }
  }

  async add(meal: Meal): Promise<void> {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return;


    const cache = this.getCache();
    cache[meal.idMeal] = meal;
    this.saveCache(cache);

    try {
      await setDoc(
        doc(this.firestore, `favourites/${user.id}/meals/${meal.idMeal}`),
        meal
      );
    } catch (e) {
    }
  }

  async remove(mealId: string): Promise<void> {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return;


    const cache = this.getCache();
    delete cache[mealId];
    this.saveCache(cache);

    try {
      await deleteDoc(
        doc(this.firestore, `favourites/${user.id}/meals/${mealId}`)
      );
    } catch (e) { }
  }

  isFavourite(mealId: string): boolean {
    return !!this.getCache()[mealId];
  }

  async toggle(meal: Meal): Promise<void> {
    this.isFavourite(meal.idMeal)
      ? await this.remove(meal.idMeal)
      : await this.add(meal);
  }
}