import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthSerivce {

  private auth = inject(Auth)
  private firestore = inject(Firestore)

  async register(name: string, email: string, password: string): Promise<boolean> {
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);
      await setDoc(doc(this.firestore, 'users', cred.user.uid), {
        id: cred.user.uid,
        name,
        email,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      const userDoc = await getDoc(doc(this.firestore, 'users', cred.user.uid));
      if (userDoc.exists()) {
        localStorage.setItem('current_user', JSON.stringify(userDoc.data()));
      }
      return true;
    } catch (err) {
      console.log(err)
      return false;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    localStorage.removeItem('current_user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('current_user');
  }

  getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem('current_user') || 'null');
  }
}