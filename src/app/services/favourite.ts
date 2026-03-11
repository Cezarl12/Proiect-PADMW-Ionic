import { Injectable, inject } from '@angular/core';
import { Meal } from '../models/meal';
import { AuthSerivce } from './auth-serivce';
import { Firestore, collection, doc, setDoc, deleteDoc, getDocs, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {

  private firestore = inject(Firestore);
  private auth = inject(AuthSerivce);

  async getAll(): Promise<Meal[]> {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return [];

    try {
      const snapshot = await getDocs(collection(this.firestore, `favourites/${user.id}/meals`));
      const meals = snapshot.docs.map(d => d.data() as Meal);

      const cache: any = {};
      meals.forEach(m => cache[m.idMeal] = m);
      localStorage.setItem(`fav_${user.id}`, JSON.stringify(cache));

      return meals;
    } catch (e) {
      const cache = JSON.parse(localStorage.getItem(`fav_${user.id}`) || '{}');
      return Object.values(cache) as Meal[];
    }
  }

  async add(meal: Meal): Promise<void> {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return;

    await setDoc(doc(this.firestore, `favourites/${user.id}/meals/${meal.idMeal}`), meal);

    const cache = JSON.parse(localStorage.getItem(`fav_${user.id}`) || '{}');
    cache[meal.idMeal] = meal;
    localStorage.setItem(`fav_${user.id}`, JSON.stringify(cache));
  }

  async remove(mealId: string): Promise<void> {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return;

    await deleteDoc(doc(this.firestore, `favourites/${user.id}/meals/${mealId}`));

    const cache = JSON.parse(localStorage.getItem(`fav_${user.id}`) || '{}');
    delete cache[mealId];
    localStorage.setItem(`fav_${user.id}`, JSON.stringify(cache));
  }

  async isFavourite(mealId: string): Promise<boolean> {
    const user = this.auth.getCurrentUser();
    if (!user?.id) return false;

    try {
      const docSnap = await getDoc(doc(this.firestore, `favourites/${user.id}/meals/${mealId}`));
      return docSnap.exists();
    } catch (e) {
      const cache = JSON.parse(localStorage.getItem(`fav_${user.id}`) || '{}');
      return !!cache[mealId];
    }
  }

  async toggle(meal: Meal): Promise<void> {
    const fav = await this.isFavourite(meal.idMeal);
    fav ? await this.remove(meal.idMeal) : await this.add(meal);
  }
}