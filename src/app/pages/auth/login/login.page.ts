import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderPage } from '../../header/header.page';
import { Router } from '@angular/router';
import { AuthSerivce } from 'src/app/services/auth-serivce';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, ReactiveFormsModule, HeaderPage]
})
export class LoginPage {

  showPassword = false;
  error = '';

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthSerivce,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) { }

  async login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.value;
    const success = await this.authService.login(email, password);
    if (success) {
      this.navCtrl.navigateRoot('/home');
    } else {
      this.error = 'Email sau parolă greșită';
    }
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
