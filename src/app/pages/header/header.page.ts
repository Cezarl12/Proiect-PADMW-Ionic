import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar, IonButtons } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AuthSerivce } from 'src/app/services/auth-serivce';

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, RouterLink]
})
export class HeaderPage {

  @Input() title: string | null = '';

  constructor(private navCtrl: NavController, private authService: AuthSerivce) { }


  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get initials(): string {
    const name = this.authService.getCurrentUser()?.name || '';
    return name

  }

  goBack() {
    this.navCtrl.back();
  }

}
