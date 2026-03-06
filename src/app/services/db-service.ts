import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
@Injectable({
  providedIn: 'root',
})
export class DbService {

  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.initWebStore();
    }

    this.db = await this.sqlite.createConnection(
      'recipehub_db', false, 'no-encryption', 1, false
    );
    await this.db.open();
    await this.createTables();
    this.initialized = true;
  }

  private async createTables(): Promise<void> {
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS favourites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        meal_id TEXT NOT NULL,
        meal_data TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS meal_cache (
        meal_id TEXT PRIMARY KEY,
        meal_data TEXT NOT NULL,
        cached_at INTEGER NOT NULL
      );
    `);
  }

  getDb(): SQLiteDBConnection {
    return this.db;
  }
}

