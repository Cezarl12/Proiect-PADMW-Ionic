import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { AuthSerivce } from 'src/app/services/auth-serivce';
import { FavouriteService } from 'src/app/services/favourite';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { HeaderPage } from '../header/header.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderPage]
})
export class ProfilePage {

  user: User | null = null;
  favouriteCount = 0;

  constructor(
    private authService: AuthSerivce,
    private favouriteService: FavouriteService,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  async ionViewWillEnter() {
    this.user = this.authService.getCurrentUser();
    const favs = await this.favouriteService.getAll();
    this.favouriteCount = favs.length;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get initials(): string {
    const name = this.user?.name || '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  }

  async logout() {
    this.authService.logout();
    const toast = await this.toastCtrl.create({
      message: 'Delogare cu succes!',
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    await toast.present();
    this.router.navigate(['/home']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
