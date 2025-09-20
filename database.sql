-- Run this on admin computer's PostgreSQL
CREATE DATABASE quotereads;

\c quotereads;

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(500),
  category VARCHAR(100),
  rating INTEGER,
  coming_soon BOOLEAN DEFAULT false,
  release_date TIMESTAMP,
  description TEXT,
  pages INTEGER,
  publisher VARCHAR(255),
  isbn VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO products (title, author, price, image, category, rating, coming_soon, release_date, description) VALUES
('New Book from Admin', 'Admin Author', 19.99, '/placeholder.jpg', 'Fiction', 5, true, '2025-03-01', 'This book was added from admin panel');

INSERT INTO posts (title, content, author, published) VALUES
('Welcome Post', 'This post was created from admin panel', 'Admin', true);