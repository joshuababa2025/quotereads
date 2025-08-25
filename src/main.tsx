import { createRoot } from 'react-dom/client'
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "@/components/ui/sonner";
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <App />
    <Toaster />
  </CartProvider>
);
