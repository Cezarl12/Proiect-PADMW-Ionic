import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderPage } from '../../header/header.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderPage]
})
export class RegisterPage {
  name = '';
  email = '';
  password = '';
  showPassword = false;
  error = '';

  constructor(private router: Router) { }

  register() {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Completează toate câmpurile';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'Parola trebuie să aibă minim 6 caractere';
      return;
    }
    this.router.navigate(['/home']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
