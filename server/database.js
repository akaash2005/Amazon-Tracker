import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

export const initDB = async () => {
  db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      title TEXT,
      current_price REAL NOT NULL,
      image TEXT,
      currency TEXT
    )
  `);
};

export const createProduct = async (product) => {
  console.log('Inserting product:', product);
  const { url, title, current_price, image, currency } = product;

  const result = await db.run(
    `INSERT INTO products (url, title, current_price, image, currency)
     VALUES (?, ?, ?, ?, ?)`,
    [url, title, current_price, image, currency]
  );

  return { id: result.lastID, ...product };
};
