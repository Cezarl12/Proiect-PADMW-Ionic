import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Meal, MealResponse } from '../models/meal';
import { Category, CategoryResponse } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private baseUrl = 'https://www.themealdb.com/api/json/v1/1';
  constructor(private http: HttpClient) { }

  searchMeals(name: string): Observable<Meal[]> {
    return this.http.get<MealResponse>(`${this.baseUrl}/search.php?s=${name}`).pipe(
      map(res => res.meals || [])
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<CategoryResponse>(`${this.baseUrl}/categories.php`).pipe(
      map(res => res.categories || [])
    );
  }

  getMealsByCategory(category: string): Observable<Meal[]> {
    return this.http.get<MealResponse>(`${this.baseUrl}/filter.php?c=${category}`).pipe(
      map(res => res.meals || [])
    );
  }

  getMealById(id: string): Observable<Meal | null> {
    return this.http.get<MealResponse>(`${this.baseUrl}/lookup.php?i=${id}`).pipe(
      map(res => res.meals ? res.meals[0] : null)
    );
  }
}
