import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderPage } from '../../header/header.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderPage]
})
export class LoginPage {

  email = '';
  password = '';
  showPassword = false;
  error = '';

  constructor(private router: Router) { }

  login() {
    if (!this.email || !this.password) {
      this.error = 'Completează toate câmpurile';
      return;
    }
    // AuthService vine după SQLite
    this.router.navigate(['/home']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
