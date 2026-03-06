import { Injectable } from '@angular/core';
import { DbService } from './db-service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthSerivce {
  constructor(private db: DbService) { }

  async register(name: string, email: string, password: string): Promise<boolean> {
    try {
      await this.db.getDb().run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
      );
      return true;
    } catch (err) {
      console.log(err)
      return false;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    const result = await this.db.getDb().query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    if (result.values && result.values.length > 0) {
      const user: User = result.values[0];
      localStorage.setItem('current_user', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('current_user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('current_user');
  }

  getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem('current_user') || 'null');
  }

}
