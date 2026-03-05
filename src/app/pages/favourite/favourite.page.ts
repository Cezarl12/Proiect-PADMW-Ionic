import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HeaderPage } from '../header/header.page';
import { Meal } from 'src/app/models/meal';
import { FavouriteService } from 'src/app/services/favourite';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.page.html',
  styleUrls: ['./favourite.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderPage]
})
export class FavouritePage {
  meals: Meal[] = [];

  constructor(
    private favouriteService: FavouriteService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.meals = this.favouriteService.getAll();
  }

  removeFavourite(event: Event, id: string) {
    event.stopPropagation();
    this.favouriteService.remove(id);
    this.meals = this.favouriteService.getAll();
  }

  goToMeal(id: string) {
    this.router.navigate(['/meal', id]);
  }

  goToExplore() {
    this.router.navigate(['/explore']);
  }
}
