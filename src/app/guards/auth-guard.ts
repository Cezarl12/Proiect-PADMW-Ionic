import { CanActivateFn } from '@angular/router';
import { AuthSerivce } from '../services/auth-serivce';
import { NavController, ToastController } from '@ionic/angular';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthSerivce);
  const navCtrl = inject(NavController);
  const toastCtrl = inject(ToastController);

  if (authService.isLoggedIn()) {
    return true;
  }

  const toast = await toastCtrl.create({
    message: '👤 Trebuie să fii logat pentru a accesa această pagină',
    duration: 2500,
    position: 'top',
    color: 'warning'
  });
  await toast.present();
  navCtrl.navigateRoot('/login');
  return false;
};