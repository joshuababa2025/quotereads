# Admin Panel Integration Guide

## Setup Requirements

### 1. Shared Backend API
Create a Node.js/Express server that both sites connect to:

```bash
# In your admin project
npm init -y
npm install express cors dotenv pg
```

### 2. Database Schema
```sql
-- Products table
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

-- Blog posts table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pre-orders table
CREATE TABLE preorders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id INTEGER REFERENCES products(id),
  customer_email VARCHAR(255) NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. API Endpoints (server.js)
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Products
app.get('/api/products', async (req, res) => {
  // Return products from database
});

app.post('/api/products', async (req, res) => {
  // Create new product (admin only)
});

// Posts
app.get('/api/posts', async (req, res) => {
  // Return published posts
});

app.post('/api/posts', async (req, res) => {
  // Create new post (admin only)
});

app.listen(3001);
```

### 4. Real-Time Updates
The frontend will automatically sync with admin changes via:
- Polling every 30 seconds
- Manual refresh triggers
- WebSocket connections (optional)

### 5. Admin Panel Structure
```
admin-panel/
├── src/
│   ├── pages/
│   │   ├── Products.tsx     # Manage products
│   │   ├── Posts.tsx        # Manage blog posts
│   │   └── PreOrders.tsx    # View pre-orders
│   └── components/
│       ├── ProductForm.tsx
│       └── PostForm.tsx
└── package.json
```

## Quick Start

1. **Set up shared database**
2. **Create API server** (runs on port 3001)
3. **Update .env** in both projects:
   ```
   VITE_API_URL=http://localhost:3001/api
   ```
4. **Admin adds content** → **Frontend auto-updates**

## Benefits
- ✅ Real-time synchronization
- ✅ Centralized data management  
- ✅ Scalable architecture
- ✅ Admin changes reflect immediately