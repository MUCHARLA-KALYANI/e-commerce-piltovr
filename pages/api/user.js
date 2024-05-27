import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aura',
};

export default async function handler(req, res) {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    if (req.method === 'POST') {
      const { name, email, password } = req.body;

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [result] = await connection.execute(
        'INSERT INTO user (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      res.status(201).json({ id: result.insertId, name, email });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error); // Log the full error object
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}