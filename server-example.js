const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/quotereads'
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product (admin only)
app.post('/api/products', async (req, res) => {
  const { title, author, price, image, category, rating, coming_soon, release_date, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (title, author, price, image, category, rating, coming_soon, release_date, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [title, author, price, image, category, rating, coming_soon, release_date, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts WHERE published = true ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create post (admin only)
app.post('/api/posts', async (req, res) => {
  const { title, content, author, published } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (title, content, author, published) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, author, published]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});