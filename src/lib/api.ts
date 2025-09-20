const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  // Products
  getProducts: () => fetch(`${API_BASE}/products`).then(r => r.json()),
  createProduct: (data: any) => fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  // Blog posts
  getPosts: () => fetch(`${API_BASE}/posts`).then(r => r.json()),
  createPost: (data: any) => fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  // Pre-orders
  getPreOrders: () => fetch(`${API_BASE}/preorders`).then(r => r.json()),
  updatePreOrder: (id: string, data: any) => fetch(`${API_BASE}/preorders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())
};