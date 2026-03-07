import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderPage } from '../../header/header.page';
import { Router } from '@angular/router';
import { AuthSerivce } from 'src/app/services/auth-serivce';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, ReactiveFormsModule, HeaderPage]
})
export class RegisterPage {
  showPassword = false;
  error = '';

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthSerivce,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) { }

  async register() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, password } = this.form.value;
    const success = await this.authService.register(name, email, password);
    if (success) {
      await this.authService.login(email, password);
      this.navCtrl.navigateRoot('/home')
    } else {
      this.error = 'Email-ul este deja folosit';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
