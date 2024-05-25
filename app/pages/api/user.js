// pages/api/products.js

import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aura',
};

export default async function handler(req, res) {
  const connection = await mysql.createConnection(dbConfig);

  if (req.method === 'GET') {
    const [rows] = await connection.execute('SELECT * FROM products');
    res.status(200).json(rows);
  } else if (req.method === 'POST') {
    const { name, price, description } = req.body;
    const [result] = await connection.execute(
      'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
      [name, price, description]
    );
    res.status(201).json({ id: result.insertId, name, price, description });
  }

  await connection.end();
}
