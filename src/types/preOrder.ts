/**
 * Type definitions for pre-order system
 * Ready for backend/admin dashboard integration
 */

export interface PreOrderStatus {
  id: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  estimatedShipDate: Date;
  actualShipDate?: Date;
  trackingNumber?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
}

export interface PreOrderCustomer {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface PreOrderMetrics {
  totalPreOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  topPreOrderProducts: Array<{
    productId: number;
    title: string;
    orderCount: number;
    revenue: number;
  }>;
  statusBreakdown: Record<PreOrderStatus['status'], number>;
  dailyPreOrders: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
}

export interface AdminPreOrderView {
  orderId: string;
  customer: PreOrderCustomer;
  product: {
    id: number;
    title: string;
    author: string;
    image: string;
    releaseDate: Date;
  };
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: PreOrderStatus;
  paymentIntentId?: string;
  notes?: string;
}

export interface PreOrderNotification {
  type: 'release_reminder' | 'shipping_update' | 'delay_notice' | 'confirmation';
  recipientEmail: string;
  scheduledFor: Date;
  sent: boolean;
  productId: number;
  orderId: string;
  subject: string;
  message: string;
}

/**
 * API endpoints structure for backend integration
 */
export interface PreOrderAPI {
  // Customer endpoints
  createPreOrder: (data: {
    productId: number;
    quantity: number;
    customerInfo: PreOrderCustomer;
  }) => Promise<{ orderId: string; paymentUrl: string }>;
  
  getCustomerPreOrders: (customerId: string) => Promise<PreOrderStatus[]>;
  
  cancelPreOrder: (orderId: string) => Promise<{ success: boolean }>;
  
  // Admin endpoints
  getAllPreOrders: (filters?: {
    status?: PreOrderStatus['status'];
    productId?: number;
    startDate?: Date;
    endDate?: Date;
  }) => Promise<AdminPreOrderView[]>;
  
  updatePreOrderStatus: (orderId: string, status: PreOrderStatus['status']) => Promise<{ success: boolean }>;
  
  getPreOrderMetrics: (dateRange?: { start: Date; end: Date }) => Promise<PreOrderMetrics>;
  
  scheduleNotification: (notification: Omit<PreOrderNotification, 'sent'>) => Promise<{ success: boolean }>;
  
  // Product management
  updateReleaseDate: (productId: number, newDate: Date) => Promise<{ success: boolean }>;
  
  togglePreOrderAvailability: (productId: number, available: boolean) => Promise<{ success: boolean }>;
}

/**
 * Webhook event types for external integrations
 */
export interface PreOrderWebhookEvent {
  type: 'preorder.created' | 'preorder.paid' | 'preorder.shipped' | 'preorder.cancelled' | 'product.released';
  timestamp: Date;
  orderId?: string;
  productId?: number;
  customerId?: string;
  data: Record<string, any>;
}

/**
 * Email template types for automated notifications
 */
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[]; // e.g., ['customerName', 'productTitle', 'releaseDate']
}